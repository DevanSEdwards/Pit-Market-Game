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
        if arg == "host":
            host_id, game_id = self.game_handler.new_game()
            self.render("views/game.html", host_id=host_id, game_id=game_id)
        else:
            self.render("views/index.html")


def main():
    # Check if this module was called in debug mode, ie:
    #   > python main.py debug
    debug = len(sys.argv) > 1 and sys.argv[1].lower() == 'debug'
    # Log all GET, POST... requests
    if debug: enable_pretty_logging()
    
    game_handler = GameHandler()

    application = tornado.web.Application([
        (r"/", MainHandler, {"game_handler": game_handler}),
        (r"/host", MainHandler, {"game_handler": game_handler})],
        # Enable live changes to code
        debug=debug
    )
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
