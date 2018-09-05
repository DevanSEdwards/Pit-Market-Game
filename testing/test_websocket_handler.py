import inspect
from main import WebsocketHandler
from modules.game import Game

def test_client_commands():
    """Check the list of commands and actual methods in the Game class align"""
    methods = [m[0] for m in inspect.getmembers(Game("",""), predicate=inspect.ismethod)]
    host_commands = [m for m in methods if m[0:2] == "hc"]
    player_commands = [m for m in methods if m[0:2] == "pc"]
    assert all([hc in WebsocketHandler.host_commands.values() for hc in host_commands])
    assert all([pc in WebsocketHandler.player_commands.values() for pc in player_commands])
    assert all([hc in host_commands for hc in WebsocketHandler.host_commands.values()])
    assert all([pc in player_commands for pc in WebsocketHandler.player_commands.values()])