import os
import sys
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

class PlayerHandler(websocket.WebSocketHandler):
    """Handle incoming player messages during a game"""
    def initialize(self, game_handler):
        """Store a reference to the game_handler instance"""
        self.game_handler = game_handler

    def open(self, player_id):
        """Store the player_id and a reference to the game"""
        self.player_id = player_id
        self.game_handler.add_player_ws(player_id, self)

class HostHandler(websocket.WebSocketHandler):
    """Handle incoming host messages during a game"""
    def initialize(self, game_handler):
        """Store a reference to the game_handler instance"""
        self.game_handler = game_handler

    def open(self, host_id):
        """Store the host_id and a reference to the game"""
        self.host_id = host_id
        self.game = self.game_handler.add_host_ws(host_id, self)
        if self.game == None:
            self.close()

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
            (r"/pws/(.*)", PlayerHandler, {"game_handler": game_handler}),
            (r"/hws/(.*)", HostHandler, {"game_handler": game_handler})
        ],
        debug=debug # Enable live changes to code
    )
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
