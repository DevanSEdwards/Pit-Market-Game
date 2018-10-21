import json
import random
import string
from uuid import uuid4
from modules.game import Game
from datetime import datetime
from math import ceil


class GameHandler:
    """Store and manage a set of all games."""

    def __init__(self):
        """
        Initialize an instance of GameHandler.
        """
        self.games = set() # Stores all current games. 

    def new_game(self):
        """
        Create a new game instance.

        @return host_id: the unique ID of the game's host.
        @return game_id: the unique ID of the game.
        """
        new_game = Game(uuid4().hex, self._generate_game_id())
        self.games.add(new_game)
        return new_game.host_id, new_game.game_id

    def _generate_game_id(self):
        """
        Create a unique ID for a game.

        @return game_id: the unique ID.
        """
        game_id = ''.join(random.choices(
            string.ascii_uppercase + string.digits, k=6))
        # Ensure unique codes
        if game_id in [g.game_id for g in self.games]:
            game_id = self._generate_game_id()
        return game_id

    def add_player(self, game_id):
        """
        Add a new player to the specified game.

        @param game_id: the game ID of the game to add a player to. 
        @return player_id: the unique ID of the added player. 
        @return None: if the game does not exist. 
        """
        for game in self.games:
            if game_id == game.game_id:
                player_id = game.add_player()
                return player_id
        # No game_id match
        return None

    def send_state(self, ws, game, client_id, is_host):
        """
        Send a comprensive message detailing the current state of a particular game. The
        exact components in the message depend on whether it is being sent to a player or 
        a host. 

        @param ws: the websocket on which to send the message.
        @param game: the ID of the game.
        @param client_id: the ID of the client.
        @param is_host: True if the client is the host of the game, False otherwise.         
        """

        # Create universal response. (ie. parameters of interest to both players and the host)
        response = {
            "type": "state",
            "clientId": game.host_id,
            "gameId": game.game_id,
            "isHost": is_host,
            "offers": [{
                "offerId": o.offer_id,
                "isSeller": o.is_seller,
                "price": o.price,
                "time": o.time
            } for o in game.offers.values()],
            "inRound": game.in_round,
            "currentRound": game.round_number,
            "roundTimer": (
                max(game.rounds[-1].length - ceil((datetime.now() - game.start_time).total_seconds()), 0)
                if game.start_time and game.in_round else None
            )
        }
        # Add host specific parameters if client is the game's host.
        response.update({
            "deckSetting": {
                "domain": game.deck_settings["domain"],
                "mean": game.deck_settings["mean"],
                "lowerLimit": game.deck_settings["lower_limit"]
            },
            "rounds": [{
                "length": r.length,
                "offerTimeLimit": r.offer_time_limit,
                "tax": r.tax,
                "ceiling": r.ceiling,
                "floor": r.floor,
                "trades": [t.price for t in r.trades]
            } for r in game.rounds]
        }
            if is_host else
        # Add player specific parameters if client is a player
        {
            "isSeller": game.players[client_id].is_seller,
            "rounds": [{
                "length": game.rounds[i].length,
                "offerTimeLimit": game.rounds[i].offer_time_limit,
                "tax": game.rounds[i].tax,
                "ceiling": game.rounds[i].ceiling,
                "floor": game.rounds[i].floor,
                "isSeller": game.players[client_id].stats[i].is_seller,
                "card": game.players[client_id].stats[i].card,
                "tradePrice": game.players[client_id].stats[i].trade_price,
                "trades": [t.price for t in game.rounds[i].trades]
            } for i in range(len(game.rounds))]
        })
        # Convert the response to JSON and send via the given websocket. 
        message = json.dumps(response)
        ws.write_message(message)

    def add_player_ws(self, ws):
        """
        Check for matching id and return the player's game instance.

        @param ws: the websocket to be used to send the game's state.
        @return game: the game to which the player belongs.
        @return None: if the player does not exist in any current game. 
        """
        for game in self.games:
            if ws.client_id in game.players:
                game.players[ws.client_id].ws = ws
                self.send_state(ws, game, ws.client_id, False)
                return game
        # No player_id match
        return None

    def add_host_ws(self, ws):
        """
        Check for matching id and return the host's game instance.

        @param ws: the websocket to be used to send the game's state.
        @return game: the game to which the host belongs.
        @return None: if the host does not exist in any current game.
        """
        for game in self.games:
            if ws.client_id == game.host_id:
                game.ws = ws
                self.send_state(ws, game, ws.client_id, True)
                return game
        # No host_id match
        return None

    def delete_game(self, game_id):
        """
        Delete a game.

        @param game_id: The ID of the game to be deleted.
        """
        for g in self.games:
            if g.game_id == game_id:
                self.games.remove(g)
                break
        
        
