import datetime
from uuid import uuid4
from modules.player import Player
from modules.offer import Offer
from modules.trade import Trade
from modules.create_deck import create_deck
import json

class Game():
    """Store and manage data about a single game"""
    def __init__(self, host_id, game_id):
        self.host_id = host_id
        self.game_id = game_id
        self.ws = None
        self.players = {} # Dictionary of players { player_id: player }
        self.is_next_seller = True # First player should be a seller
        self.offers = {} # Dictionary of offers {offer_id: Offer}
        self.trades = {} # Dictionary of trades {offer_id: trade }
        self.round_number = 0 #Initialise round number

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
        self.round_number += 1 #increment round numner
        sell_deck, buy_deck = create_deck(len(self.players))
        for player in self.players:
            if player.is_seller:
                try:
                    player.give_card(sell_deck.pop())
                except KeyError:
                    player.give_card(buy_deck.pop())
            else:
                try:
                    player.give_card(buy_deck.pop())
                except KeyError:
                    player.give_card(sell_deck.pop())
        pass

    def hc_end_round(self):
        """Bring the current round to a premature end"""
        response = {
                "type" : "end round"
            }
        self.send_message(response)
        pass

    def hc_end_game(self):
        """Delete the game and disconnect all clients"""
        response = {
                "type" : "end game"
            }
        self.send_message(response)
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
        #Generate offer_id
        offer_id = uuid4().hex
        time = datetime.datetime.now()
        #check player has not traded
        if (not self.players[player_id].has_traded):
            #if Seller
            if self.players[player_id].is_seller:
                #valid offer
                if (self.players[player_id].card <= price): 
                    #add to offer dictionary
                    self.offers[offer_id] = Offer(offer_id, True, price, time, player_id)
                    self.message_all(json.dumps(
                        {
                            "type": "offer",
                            "offer_id": offer_id,
                            "isSeller": True,
                            "price": price,
                            "time": time
                        }))
                #invalid trade

            #must be a buyer
            else:
                #valid offer
                if (self.players[player_id].card >= price):
                    #add to offer dictionary
                    self.offers[offer_id] = Offer(offer_id, False, price, time, player_id)
                    self.message_all(json.dumps(
                        {
                            "type": "offer",
                            "offer_id": offer_id,
                            "isSeller": False,
                            "price": price,
                            "time": time
                        }))
                #invalid trade 


        #Add check that offer hasn't been posted by player for 10 seconds %UNSURE HOW TO DO THIS
        pass

    def pc_accept(self, player_id, offer_id):
        """Verify and complete a trade"""
        time = datetime.datetime.now()
        #check if offer has been accepted yet
        if not self.offers[offer_id].accepted:
            #check if still within 10 seconds
            if datetime.datetime.now() > (self.offers[offer_id].time + datetime.timedelta(seconds=10)):
                #check accepted has not traded yet
                if not self.players[player_id].has_traded:
                    #accepter is buyer and offerer is seller
                    if (self.players[player_id].is_seller and not self.offers[offer_id].is_seller):
                        #valid trade
                        if (self.players[player_id].card <= self.offers[offer_id].price):
                            #acknowlege offer has been accepted
                            self.offers[offer_id].accepted = True
                            #add to trade dictionary
                            self.trades[offer_id] = Trade(offer_id, self.offers[offer_id].price, time, player_id, self.offers[offer_id].player_id)
                            # Send message to players
                            self.players[player_id].ws.write_message(json.dumps(
                                {
                                    "type" : "trade",
                                    "success": True,
                                    "offerID": offer_id,
                                    "price": self.offers[offer_id].price
                                }))
                            self.players[self.offers[offer_id].player_id].ws.write_message(json.dumps(
                                {
                                    "type" : "trade",
                                    "success": True,
                                    "offerID": offer_id,
                                    "price": self.offers[offer_id].price
                                }))
                            # Seng message to all
                            self.message_all(json.dumps(
                                {
                                    "type": "announce trade",
                                    "price": self.offers[offer_id].price,
                                    "time": datetime.datetime.now(),
                                    "round number": self.round_number
                                }))
                            # set player.has_traded to True
                            self.players[player_id].has_traded = True
                            self.players[self.offers[offer_id].player_id] = True
                    #accepter is seller and offerer is buyer
                    if (self.players[player_id].is_seller and not self.offers[offer_id].is_seller):
                        #valid trade
                        if (self.players[player_id].card >= self.offers[offer_id].price):
                            #acknowlege offer has been accepted
                            self.offers[offer_id].accepted = True
                            #add trade to dicitonary
                            self.trades[offer_id] = Trade(offer_id, self.offers[offer_id].price, time, self.offers[offer_id].player_id, player_id)
                            # Send message to players
                            self.players[player_id].ws.write_message(json.dumps(
                                {
                                    "type" : "trade",
                                    "success": True,
                                    "offerID": offer_id,
                                    "price": self.offers[offer_id].price
                                }))
                            self.players[self.offers[offer_id].player_id].ws.write_message(json.dumps(
                                {
                                    "type" : "trade",
                                    "success": True,
                                    "offerID": offer_id,
                                    "price": self.offers[offer_id].price
                                }))
                            # Seng message to all
                            self.message_all(json.dumps(
                                {
                                    "type": "announce trade",
                                    "price": self.offers[offer_id].price,
                                    "time": datetime.datetime.now(),
                                    "round number": self.round_number
                                }))
                            self.players[player_id].has_traded = True
                            self.players[self.offers[offer_id].player_id] = True
       
       #API 17 ws message 
        # "{
        # ""type"": ""trade"",
        # ""success"": true,
        # ""offerId"": offer_id,
        # ""price"": self.offers[offer_id].price
        #     }"


        # "{
        #     ""type"": ""announce trade"",
        #     ""price"": self.offer[offer_id].price,
        #     ""time"": datetime.datetime.now(),
        #     ""round number"": 1
        # }"

        

    # - Utilities -----------------------------------------------------

    def message_all(self, message):
        self.ws.write_message(message)
        for player in self.players:
            player.ws.write_message(message)

    def send_message(self, response):
        message = json.dumps(response)
        self.ws.write_message(message)
        for player in self.players:
            player.ws.write_message(message)
       
