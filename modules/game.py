from uuid import uuid4
from modules.player import Player

class Game():
    """Store and manage data about a single game"""
    def __init__(self, host_id, game_id):
        self.host_id = host_id
        self.game_id = game_id
        self.players = set()

    def add_player(self):
        player_id = uuid4().hex
        self.players.add(Player(player_id))
        return player_id