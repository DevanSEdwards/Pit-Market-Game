from uuid import uuid4
from modules.player import Player
from modules.create_deck import create_deck

class Game():
    """Store and manage data about a single game"""
    def __init__(self, host_id, game_id):
        self.host_id = host_id
        self.game_id = game_id
        self.ws = None
        self.players = {} # Dictionary of players { player_id: player }
        self.is_next_seller = True # First player should be a seller
        self.offers = {} # Dictionary of offers {offer_id: String, type: String
                        #    isSeller: bool, Price: int, player_id: player }

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
        pass

    def hc_end_game(self):
        """Delete the game and disconnect all clients"""
        pass

    # - Player Commands -----------------------------------------------
    #   These methods should only be called inside WebsocketHandler
    #   Should start with 'pc' and have player_id as an argument

    def pc_offer(self, player_id, price):
        """Verify and post a new offer to the game"""
        #Generate offer_id
        offer_id = uuid4().hex
        self.player_id = player_id
        self.price = price
        #check offer
        #if Seller
        if player[player_id].is_seller:
            #valid offer
            if player[player_id].card >= price:
                #add to offer dictionary
                self.offers[offer_id] = Offer(offer_id, "offer", True, price, player_id)
                self.message_all(json.dumps({"type": "offer", offer_id: offer_id, isSeller: True, price: price, time: time})
            #invalid trade
            else:
        #must be a buyer
        else:
            #valid offer
            if player[player_id].card <= price:
                #add to offer dictionary
                self.offers[offer_id] = Offer(offer_id, "offer", False, price, player_id)
                self.message_all(json.dumps({"type": "offer", offer_id: offer_id, isSeller: False, price: price, time: time})
            #invalid trade 
            else 

        #Add check that offer hasn't been posted for 10 seconds
        pass

    def pc_accept(self, player_id, offer_id):
        """Verify and complete a trade"""
        #Buyer Vs Seller
        #Check valid trade 
        #Check time constaints 
        #remove offer from offers using offer_id as key
        # successful trade message to 2 players (17 in API)
        # send message to all (18 in API)


        #if Seller
        if player[player_id].is_seller:
            #valid trade
            if 
        #must be a buyer
        else:

        pass

    # - Utilities -----------------------------------------------------

    def message_all(self, message):
        self.ws.write_message(message)
        for player in self.players:
            player.ws.write_message(message)
       