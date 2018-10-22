import json
import tornado.ioloop
import math
import csv
import os
from datetime import datetime, timedelta
from uuid import uuid4
from modules.player import Player
from modules.offer import Offer
from modules.trade import Trade
from modules.create_deck import create_deck
from modules.send_email import send
from modules.trade_exception import TradeError
from modules.round import Round
from modules.player_stat import PlayerStat
from termcolor import cprint


class Game():
    """Store and manage data about a single game"""

    def __init__(self, host_id, game_id):
        """
        Initialize an instance of Game.

        @param host_id: the unique ID of this game's host.
        @param game_id: the unique ID of this game.
        """
        self.host_id = host_id
        self.game_id = game_id
        self.ws = None
        self.players = {}  # Dictionary of players { player_id: player }
        self.is_next_seller = True  # First player should be a seller
        self.offers = {}  # Dictionary of offers {offer_id: Offer}
        self.round_number = 0  # Initialise round number
        self.rounds = []  # List of Round settings
        self.deck_settings = {  # Shouldn't be changed after the first round
            'domain': 17,
            'mean': 13,
            'lower_limit': 2,
        }
        self.in_round = False
        self.game_data = []

        # Store a reference to the IO loop, to be used for calling:
        # self.io.call_later(...)
        self.io = tornado.ioloop.IOLoop.current()
        self.start_time = None
        self.force_end_round = None
        # Remove previous games CSV data   

    def add_player(self):
        """
        Add a new player to the game.

        @return player_id: the unique ID to be associated with the added player.
        """
        player_id = uuid4().hex
        self.players[player_id] = Player(player_id, self.is_next_seller)
        # TODO give player a card if they join halfway through?
        self.players[player_id].stats = [PlayerStat(None, None, None)] * len(self.rounds)
        # Alternate between buyer and seller for each new player
        self.is_next_seller = not self.is_next_seller
        return player_id
    
		

    # - Host Commands -------------------------------------------------
    #   These methods should only be called inside WebsocketHandler
    #   Should start with 'hc'

    def hc_start_round(self, length, offerTimeLimit, tax, ceiling, floor):
        """
        Starts a single round within this game with the given specifications.

        @param length: the duration (in seconds) of the round.
        @param offerTimeLimit: the duration (in seconds) that any single offer is available.
        @param tax: the tax to be applied to seller players.
        @param ceiling: the maximum value that an offer may take. (must be =0 if floor =/= 0)
        @param floor: the minimum value that an offer may take. (must be =0 if ceiling =/= 0)
        """

        # Delete all offers
        self.offers = {}
        # Create a new round object to store round data
        self.rounds.append(Round(length, offerTimeLimit, tax, ceiling, floor))
        # Increment round number
        self.round_number = len(self.rounds) - 1
        # Set all players to not traded
        for p in self.players.values():
            p.has_traded = False
        # Distribute cards to player according to their buyer/seller identity.
        # Change that identity if buyer/seller deck is empty
        sell_deck, buy_deck = create_deck(
            len(self.players), **self.deck_settings)
        for player in self.players.values():
            if player.is_seller:
                try:
                    player.give_card(sell_deck.pop())
                except KeyError:
                    player.is_seller = False
                    player.give_card(buy_deck.pop())
            else:
                try:
                    player.give_card(buy_deck.pop())
                except KeyError:
                    player.is_seller = True
                    player.give_card(sell_deck.pop())
        # Record the player stats for later
        for player in self.players.values():
            player.stats.append(PlayerStat(player.card, player.is_seller, None))
        # Setup function to end the round later
        self.force_end_round = self.io.call_later(length, self.end_round)

        # Inform host that round is starting
        response = {
            "type": "start round",
            "length": length,
            "offer time limit": offerTimeLimit,
            "tax": tax,
            "ceiling": ceiling,
            "floor": floor
        }
        self.ws.write_message(json.dumps(response))
        # Inform players of their card number and buyer/seller identity
        for player in self.players.values():
            response.update({
                "card": player.card,
                "isSeller": player.is_seller
            })
            message = json.dumps(response)
            if player.ws is not None:
                player.ws.write_message(message)
        self.start_time = datetime.now()

        self.in_round = True

    def hc_end_round(self):
        """Bring the current round to a premature end"""
        self.generate_round_data()
        self.io.remove_timeout(self.force_end_round)
        self.end_round()

    def hc_end_game(self):
        """
        Delete the game and disconnect all clients
        """
        response = {
            "type": "end game",
            "sellDeck": [p.card for p in self.players.values() if p.is_seller],
            "buyDeck": [p.card for p in self.players.values() if not p.is_seller]
        }
        self.message_all(response)
        for player in self.players.values():
            if player.ws is not None:
                player.ws.close()
        self.ws.close()
        self.ws.game_handler.delete_game(self.game_id)

    def hc_card_settings(self, domain, mean, lowerLimit):
        """
        Initialize the deck settings. These settings will be used to create a deck
        at the start of each round. 

        @param domain: the range of values that cards may take.
        @param mean: the average value of all distributed cards.
        @param lowerLimit: the minimum value that any card may take.
        """
        self.deck_settings["domain"] = domain
        self.deck_settings["mean"] = mean
        self.deck_settings["lower_limit"] = lowerLimit


    def hc_send_email(self,address):
        """Export end email game data CSV"""
        self.export_csv()
        send(self.game_id,str(address))
        

    # - Player Commands -----------------------------------------------
    #   These methods should only be called inside WebsocketHandler
    #   Should start with 'pc' and have player_id as an argument

    def pc_offer(self, player_id, price):
        """
        Verify and post a new offer to the game.

        @param player_id: the ID of the player posting the offer.
        @param price: the offered price.
        @raise TradeError: occurs if the offer is not valid.
        """

        # Generate offer_id
        offer_id = uuid4().hex
        # milliseconds since the start of the round
        time = math.ceil((datetime.now() - self.start_time).total_seconds() * 1000)
        player = self.players[player_id]
        tax = self.rounds[self.round_number].tax
        ceiling = self.rounds[self.round_number].ceiling
        floor = self.rounds[self.round_number].floor

        # Check offer is valid
        if player.has_traded:
            raise TradeError("Already traded this round")
        if price is None:
            raise TradeError("No price specified")
        if player.is_seller:
            if price < player.card + tax:
                raise TradeError("Price out of range (below seller card + tax)")
        else:
            if price > player.card:
                raise TradeError("Price out of range (above buyer card)")
        if ceiling is not None:
            if ceiling < price:
                raise TradeError("Price out of range (ceiling)")
        elif floor is not None:
            if floor > price:
                raise TradeError("Price out of range (floor)")

        # Remove Existing offers
        for key, offer in self.offers.items():
            if offer.player_id == player_id:
                # Only let better offers through
                if offer.price <= price if player.is_seller else offer.price >= price:
                    raise TradeError("Newer offer not better")
                self.delete_offer(key)
                break

        # Add offer to the dictionary
        self.offers[offer_id] = Offer(
            offer_id, player.is_seller, price, time, player_id, self.io.call_later(self.rounds[self.round_number].offer_time_limit, self.delete_offer, offer_id))
        # Announce the offer to all clients
        self.message_all(
            {
                "type": "offer",
                "offerId": offer_id,
                "isSeller": player.is_seller,
                "price": price,
                "time": str(time)
            })

    def pc_accept(self, player_id, offerId):
        """
        Verify and complete a trade.

        @param player_id: the id of the player accepting the offer.
        @param offerID: the id of the offer being accepted. 
        @raise TradeError: occurs if the trade is not valid/legal. 
        """
        offer_id = offerId
        time = datetime.now()
        if offer_id not in self.offers:
            raise TradeError("Offer expired")
        player, offer, price, tax = (
            self.players[player_id],
            self.offers[offer_id],
            self.offers[offer_id].price,
            self.rounds[self.round_number].tax
        )

        # Check trade is valid
        if player_id == offer.player_id:
            raise TradeError("Trading with yourself??")
        if player.has_traded:
            raise TradeError("Already traded this round")
        if player.is_seller == offer.is_seller:
            print(player.is_seller)
            print(offer.is_seller)
            raise TradeError("Buyer/Seller mismatch")
        # Price range check
        if player.is_seller and (player.card + tax) > price:
            raise TradeError("Price out of range")
        if not player.is_seller and player.card < price:
            raise TradeError("Price out of range")

        # Acknowlege offer has been accepted
        offer.accepted = True
        # Add to trade dictionary
        self.rounds[self.round_number].trades.append(Trade(
            offer_id, price, time, player_id, self.offers[offer_id].player_id))

        for p in (player, self.players[offer.player_id]):
            # Record that thes players have traded
            p.has_traded = True
            # Record the trade price
            p.stats[self.round_number].trade_price = price
            # Send trade confirmation to players involved
            p.ws.write_message(json.dumps(
                {
                    "type": "trade",
                    "success": True,
                    "offerID": offer_id,
                    "price": self.offers[offer_id].price
                }))
        # Announce trade to all clients
        self.message_all(
            {
                "type": "announce trade",
                "price": price,
                "time": str(time),
                "round number": self.round_number
            })
        self.delete_offer(offer_id)

    # - Utilities -----------------------------------------------------

    def delete_offer(self, offer_id):
        self.message_all({
            "type": "remove offer",
            "offerId": offer_id
        })
        self.io.remove_timeout(self.offers[offer_id]._delete_event)
        del self.offers[offer_id]

    def end_round(self):
        """
        End the current round and inform all participants.
        """
        response = {
            "type": "end round"
        }
        self.message_all(response)
        self.in_round = False

    def message_all(self, response):
        """
        Send a JSON message to all game participants. 

        @param response: a dictionary to be converted to JSON format and broadcast.
        """
        message = json.dumps(response)
        if self.ws is not None:
            self.ws.write_message(message)
        else:
            print("Host Disconnected")
        cprint("=> " + message, 'green', 'on_white')
        for player in self.players.values():
            if player.ws is not None:
                player.ws.write_message(message)
            else:
                print(player.player_id + " Disconnected")

    def generate_round_data(self):
        """Generate game data for CSV"""
        # To get the current Round
        roundNumber = self.round_number
        # To get the data for each round: tax,floor and ceiling
        roundInfo = list(vars(self.rounds[roundNumber]).values())
        taxValue,floorValue,ceilingValue = roundInfo[2],roundInfo[3],roundInfo[4]
        # Get a list of trades in the round
        trades = self.rounds[roundNumber].trades
        # Extract the game ID
        gameID = self.game_id
        # Extract info about each trade in the round
        for trade in trades:
            price = trade.price
            buyerID = trade.buyer_id
            sellerID = trade.seller_id
            buyerCard = str(self.players[buyerID].stats[0].card)
            sellerCard = str(self.players[sellerID].stats[0].card)
            roundData = [gameID,roundNumber,price,buyerCard,sellerCard,buyerID,sellerID,taxValue,ceilingValue,floorValue]
            # game_data contains a list of lists to be exported as a csv for each round.
            self.game_data.append(roundData)

    def export_csv(self):
        """Export The game data to a CSV"""
        # Headers for the CSV file in order of output
        headers = ["Game ID","Round Number","Trade Price","Buyer Card","Seller Card","BuyerID","SellerID","Tax Value","Ceiling Value","Floor Value"]

        with open('gameData_'+self.game_id+'.csv','w',newline='') as file:
            writer = csv.writer(file)
            writer.writerow(headers)
            writer.writerows(self.game_data)

    