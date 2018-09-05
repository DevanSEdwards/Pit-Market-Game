import os
import sys
import json
import inspect
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado import websocket
from tornado.web import RequestHandler
from tornado.log import enable_pretty_logging
from modules.game_handler import GameHandler

class MainHandler(RequestHandler):
    """Handle GET requests"""
    def initialize(self, game_handler):
        """Store a reference to the game handler instance"""
        self.game_handler = game_handler

    def get(self):
        arg = self.get_argument("game", default="")
        # Hosting a new game
        if arg == "host":
            host_id, game_id = self.game_handler.new_game()
            self.render(
                "views/game.html",
                hostId = host_id,
                gameId = game_id,
                playerId = ""
            )
        # Attempting to join a game
        elif len(arg) == 6 and arg.isalnum():
            player_id = self.game_handler.add_player(arg)
            if player_id == None:
                self.render("views/index.html")
            else:
                self.render(
                    "views/game.html",
                    hostId = "",
                    gameId = "",
                    playerId = player_id
                )
        # Render main page
        else:
            self.render("views/index.html")

class WebsocketHandler(websocket.WebSocketHandler):
    """Handle incoming messages during a game"""

    # Dictionaries of Game methods to call.
    # Indexed by the corresponding message type, like:
    # "msg_type" : "method_name"
    host_commands = {
        "start round": "start_round"
    }

    player_commands = {}

    def initialize(self, game_handler, host):
        """Store a reference to the game_handler instance"""
        self.game_handler = game_handler
        self.host = host
        self.commands = (
            WebsocketHandler.host_commands if host else 
            WebsocketHandler.player_commands
        )

    def open(self, client_id):
        """Store the client_id and a reference to their game"""
        self.client_id = client_id
        self.game = (
            self.game_handler.add_host_ws(client_id, self) if self.host else
            self.game_handler.add_player_ws(client_id, self)
        )
        if self.game == None:
            self.close()

    def on_message(self, message):
        """Call the appropriate Game method, based on the message type"""
        msg = json.loads(message)

        # If type is unknown send an error message
        if msg.type not in self.commands:
            self.write_message({"type": "error", "message": "bad type"})
            return
        
        # If client is a player, add the player_id to the message
        if not self.host:
            msg["player_id"] = self.client_id
        
        method = getattr(self.game, self.commands[msg.type])
        arguments = {arg: msg[arg] for arg in inspect.getargspec(method).args[1:]} # Add try-catch later
        
        # Call the method with corresponding arguments
        method(**arguments)

def main():
    # Check if this module was called in debug mode, ie:
    #   > python main.py debug
    debug = len(sys.argv) > 1 and sys.argv[1].lower() == 'debug'
    # Log all GET, POST... requests
    if debug: enable_pretty_logging()
    
    game_handler = GameHandler()

    application = tornado.web.Application(
        [
            (r"/", MainHandler, {"game_handler": game_handler}),
            (r"/hws/(.*)", WebsocketHandler, {"game_handler": game_handler, "host": True}),
            (r"/pws/(.*)", WebsocketHandler, {"game_handler": game_handler, "host": False})
        ],
        debug=debug # Enable live changes to code
    )
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
