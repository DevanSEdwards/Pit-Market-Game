import json
import random
import string
from uuid import uuid4
from modules.game import Game

class GameHandler():
    """Store and manage a set of all games"""
    def __init__(self):
        self.games = set()

    def new_game(self):
        """Create a new game instance and return (host_id, game_id)"""
        new_game = Game(uuid4().hex, self._generate_game_id())
        self.games.add(new_game)
        return new_game.host_id, new_game.game_id

    def _generate_game_id(self):
        """Return a unique 6 letter/digit code"""
        game_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        if game_id in [g.game_id for g in self.games]:
            game_id = self._generate_game_id()
        return game_id
    
    def add_player(self, game_id):
        """Check if the game_id matches a current game and create a new player
    
        Return the player_id"""
        for g in self.games:
            if game_id == g.game_id:
                player_id = g.add_player()
                return player_id
        # No game_id match
        return None