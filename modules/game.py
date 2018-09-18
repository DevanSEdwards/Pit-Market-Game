from datetime import datetime, timedelta
from uuid import uuid4
from modules.player import Player
from modules.offer import Offer
from modules.trade import Trade
from modules.create_deck import create_deck
from modules.trade_exception import TradeError
import json
import sched
import time


class Game():
    """Store and manage data about a single game"""

    def __init__(self, host_id, game_id):
        self.host_id = host_id
        self.game_id = game_id
        self.ws = None
        self.players = {}  # Dictionary of players { player_id: player }
        self.is_next_seller = True  # First player should be a seller
        self.offers = {}  # Dictionary of offers {offer_id: Offer}
        self.trades = {}  # Dictionary of trades {offer_id: trade }
        self.round_number = 0  # Initialise round number
        self.sched = sched.scheduler(time.time, time.sleep)

    def add_player(self):
        player_id = uuid4().hex
        self.players[player_id] = Player(player_id, self.is_next_seller)
        # Alternate between buyer and seller for each new player
        self.is_next_seller = not self.is_next_seller
        return player_id

    # - Host Commands -------------------------------------------------
    #   These methods should only be called inside WebsocketHandler
    #   Should start with 'hc'

    def hc_start_round(self):
        self.round_number += 1  # increment round numner
        sell_deck, buy_deck = create_deck(len(self.players))
        # - Distribute cards to player according to their buyer/seller identity.
        # - Change that identity if buyer/seller deck is empty
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

        # - Inform host and all players that round is starting
        response = {
            "type": "start round",
            "length": 120,
            "offer time limit": 10
        }
        self.message_all(response)

        # - Inform players of their card number and buyer/seller identity
        for player in self.players.values():
            response = {
                "type": "card",
                "value": player.card,
                "isSeller": player.is_seller
            }
            message = json.dumps(response)
            player.ws.write_message(message)

    def hc_end_round(self):
        """Bring the current round to a premature end"""
        response = {
            "type": "end round"
        }
        self.message_all(response)
        pass

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
        pass

    # - Player Commands -----------------------------------------------
    #   These methods should only be called inside WebsocketHandler
    #   Should start with 'pc' and have player_id as an argument

    def pc_offer(self, player_id, price):
        """Verify and post a new offer to the game"""
        # Generate offer_id
        print("offer: " + player_id, price)
        offer_id = uuid4().hex
        time = datetime.now()
        player = self.players[player_id]

        # Check offer is valid
        if player.has_traded:
            raise TradeError("Already traded this round")
        if (player.is_seller == (player.card > price)) and (player.card != price):
            raise TradeError("Price out of range")
        
        # Add offer to the dictionary
        self.offers[offer_id] = Offer(
            offer_id, True, price, time, player_id)
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
        print("accept")
        offer_id = offerId
        time = datetime.now()
        player, offer, price = self.players[player_id], self.offers[offer_id], self.offers[offer_id].price

        # Check trade is valid
        if offer.accepted:
            raise TradeError("Offer already accepted")
        if False and (time > (offer.time + timedelta(seconds=1000))):
            raise TradeError("Offer expired")
        if player.has_traded:
            raise TradeError("Already traded this round")
        if player.is_seller == offer.is_seller:
            raise TradeError("Buyer/Seller mismatch")
        if (player.is_seller == (player.card > price)) and (player.card != price):
            raise TradeError("Price out of range")

        # Acknowlege offer has been accepted
        offer.accepted = True
        # Add to trade dictionary
        self.trades[offer_id] = Trade(
            offer_id, price, time, player_id, self.offers[offer_id].player_id)
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

    # - Utilities -----------------------------------------------------

    def message_all(self, response):
        message = json.dumps(response)
        if self.ws:
            self.ws.write_message(message)
        print("message_all: " + message)
        for player in self.players.values():
            if player.ws:
                player.ws.write_message(message)
