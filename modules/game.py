import json
import tornado.ioloop
from datetime import datetime, timedelta
from uuid import uuid4
from modules.player import Player
from modules.offer import Offer
from modules.trade import Trade
from modules.create_deck import create_deck
from modules.trade_exception import TradeError
from modules.round import Round


class Game():
    """Store and manage data about a single game"""

    def __init__(self, host_id, game_id):
        self.host_id = host_id
        self.game_id = game_id
        self.ws = None
        self.players = {}  # Dictionary of players { player_id: player }
        self.is_next_seller = True  # First player should be a seller
        self.offers = {}  # Dictionary of offers {offer_id: Offer}
        self.round_number = 0  # Initialise round number
        self.rounds = []  # List of Round settings
        self.deck = { # Shouldn't be changed after the first round
            'domain': None,
            'mean': None,
            'lower_limit': None,
        }
        #deck_settings["domain"] = 

        # Store a reference to the IO loop, to be used for calling:
        # self.io.call_later(...)
        self.io = tornado.ioloop.IOLoop.current()
        self.force_end_round = None
        self.start_time_milli = None

    def add_player(self):
        player_id = uuid4().hex
        self.players[player_id] = Player(player_id, self.is_next_seller)
        # Alternate between buyer and seller for each new player
        self.is_next_seller = not self.is_next_seller
        return player_id

    # - Host Commands -------------------------------------------------
    #   These methods should only be called inside WebsocketHandler
    #   Should start with 'hc'

    def hc_start_round(self, length, offerTimeLimit, tax, ceiling, floor):
        """"""
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
        # Setup function to end the round later
        self.force_end_round = self.io.call_later(length, self.end_round) 
 
        # Inform host and all players that round is starting
        response = {
            "type": "start round",
            "length": length,
            "offer time limit": offerTimeLimit
        }
        self.message_all(response)
        # Inform players of their card number and buyer/seller identity
        for player in self.players.values():
            response = {
                "type": "card",
                "value": player.card,
                "isSeller": player.is_seller
            }
            message = json.dumps(response)
            player.ws.write_message(message)
        self.start_time_milli = int(round(time.time() * 1000))

    def hc_end_round(self):
        """Bring the current round to a premature end"""
        self.io.cancel(force_end_round)
        self.end_round()

    def hc_end_game(self):
        """Delete the game and disconnect all clients"""
        response = {
            "type": "end game"
        }
        self.message_all(response)
        for player in self.players:
            player.ws.close()
        self.ws.close()
        self.game_finished = True
        del self

    def hc_card_settings(self, domain, mean, lowerLimit)
        """Initliaise the deck settings"""
        self.deck[domain] = domain
        self.deck[mean] = mean
        self.deck[lowerLimit] = lowerLimit

    # - Player Commands -----------------------------------------------
    #   These methods should only be called inside WebsocketHandler
    #   Should start with 'pc' and have player_id as an argument

    def pc_offer(self, player_id, price):
        """Verify and post a new offer to the game"""
        # Generate offer_id
        print("offer: " + player_id, price)
        offer_id = uuid4().hex
        time = int(round(time.time() * 1000)) - self.start_time_milli # milliseconds since the start of the round
        player = self.players[player_id]

        # Check offer is valid
        if player.has_traded:
            raise TradeError("Already traded this round")
        if (player.is_seller and (player.card < price + tax)):
            raise TradeError("Price out of range")
        if (not player.is_seller and (player.card > price)):
            raise TradeError("Price out of range")

        # Add offer to the dictionary
        self.offers[offer_id] = Offer(
            offer_id, True, price, time, player_id)

        self.io.call_later(10, self.delete_offer, offer_id)
        # Announce the offer to all clients
        self.message_all(
            {
                "type": "offer",
                "offerId": offer_id,
                "isSeller": True,
                "price": price,
                "time": str(time)
            })

        # Add check that offer hasn't been posted by player for 10 seconds %UNSURE HOW TO DO THIS

    def pc_accept(self, player_id, offerId):
        """Verify and complete a trade"""
        offer_id.= offerId
        time = datetime.now()
        if offer_id not in self.offers:
            raise TradeError("Offer expired")
        player, offer, price, tax = self.players[player_id], self.offers[offer_id], self.offers[offer_id].price, self.rounds[self.round_number].tax

        # Check trade is valid

        if player.has_traded:
            raise TradeError("Already traded this round")
        if player.is_seller == offer.is_seller:
            raise TradeError("Buyer/Seller mismatch")
        # Price range check    
        if (player.is_seller and ((player.card + tax) > price))
            raise TradeError("Price out of range")
        if (not player.is_seller and (player.card < (price + tax):
            raise TradeError("Price out of range")
        
        # Acknowlege offer has been accepted
        offer.accepted = True
        # Add to trade dictionary
        self.rounds[self.round_number].trades.append(Trade(
            offer_id, price, time, player_id, self.offers[offer_id].player_id))
        # Record that thes players have traded
        player.has_traded = True
        self.players[offer.player_id].has_traded = True

        # Send trade confirmation to players involved
        for p in (player, self.players[offer.player_id]):
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
        del self.offers[offer_id]

    def end_round(self):
        response = {
            "type": "end round"
        }
        self.message_all(response)

    def message_all(self, response):
        message = json.dumps(response)
        if self.ws:
            self.ws.write_message(message)
        print("message_all: " + message)
        for player in self.players.values():
            if player.ws:  # BUG sometimes this gets called without player.ws existing
                player.ws.write_message(message)
