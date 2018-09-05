from uuid import uuid4
from modules.player import Player

class Game():
    """Store and manage data about a single game"""
    def __init__(self, host_id, game_id):
        self.host_id = host_id
        self.game_id = game_id
        self.ws = None
        self.players = {} # Dictionary of players { player_id: player }

    def add_player(self):
        player_id = uuid4().hex
        self.players[player_id] = Player(player_id)
        return player_id