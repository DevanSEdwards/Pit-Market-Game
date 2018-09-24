import os
import sys
import json
import inspect
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado import websocket
from tornado.web import RequestHandler
from modules.game_handler import GameHandler
from modules.trade_exception import TradeError
if __debug__:
    from tornado.log import enable_pretty_logging


class MainHandler(RequestHandler):
    """Handle GET requests"""

    def initialize(self, game_handler):
        """Store a reference to the game handler instance"""
        self.game_handler = game_handler

    def get(self):
        # TODO send gameId, isHost and clientId as cookies
        arg = self.get_argument("game", default="")
        # Hosting a new game (/?game=host)
        if arg == "host":
            host_id, game_id = self.game_handler.new_game()
            # for game in self.game_handler.games:
            #     print(game.host_id)
            self.render(
                "views/host.html",
                clientId=host_id,
                gameId=game_id,
                isHost="true"
            )
        # Attempting to join a game (/?game=GAMEID)
        elif len(arg) == 6 and arg.isalnum():
            player_id = self.game_handler.add_player(arg)
            if player_id == None:
                self.render("views/index.html")
            else:
                self.render(
                    "views/game.html",
                    clientId=player_id,
                    gameId="",
                    isHost="false"
                )
        # Render main page (/)
        else:
            self.render("views/index.html")


class WebsocketHandler(websocket.WebSocketHandler):
    """Handle incoming messages during a game

    It is expected that each type of message will be passed to a 
    corresponding method in a Game instance, and that the host_commands
    and player_commands static attributes will be updated to reflect
    that. No other changes to this class should need to be made.
    """
    # Dictionaries of Game methods to call.
    # Indexed by the corresponding message type, like:
    # "msg_type" : "method_name"
    host_commands = {
        "start round": "hc_start_round",
        "end round": "hc_end_round",
        "end game": "hc_end_game"
    }
    player_commands = {
        "offer": "pc_offer",
        "accept": "pc_accept"
    }

    # TODO add method for setting if host or player
    # TODO add method for setting client_id

    def initialize(self, game_handler, host):
        """Store a reference to the game_handler instance and whether
        the client is a host.
        """
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
        self.set_nodelay(True)

    def on_close(self):
        if self.host:
            self.game.hc_end_game()
        else:
            self.game.remove_player(self.client_id)

    def on_message(self, message):
        """Call the appropriate Game method, based on the message type"""
        print("ws msg: " + message)
        msg = json.loads(message)
        # Check msg contains a type attribute
        if "type" not in msg:
            self.write_message(json.dumps({
                "type": "error",
                "message": "no type attribute"
            }))
            return
        # If type is unknown send an error message
        if msg["type"] not in self.commands:
            self.write_message(json.dumps({
                "type": "error",
                "message": "unknown type"
            }))
            return

        # If client is a player, add the player_id to the message
        if not self.host:  # TODO and self.client_id
            msg["player_id"] = self.client_id

        method = getattr(self.game, self.commands[msg["type"]])
        try:
            arguments = {arg: msg[arg]
                         for arg in inspect.getargspec(method).args[1:]}
        except KeyError as error:
            print("Missing attribute: " + error.args[0])

        # Call the method with corresponding arguments
        try:
            method(**arguments)
        except TradeError as error:
            print(error.message)


def main():
    if __debug__:
        # Log all GET, POST... requests
        enable_pretty_logging()

    game_handler = GameHandler()

    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "public"),
        "debug": __debug__,
        "websocket_ping_interval": 20  # Keeps connection alive on heroku
    }
    urls = [
        (r"/", MainHandler, {"game_handler": game_handler}),
        (r"/hws/(.*)", WebsocketHandler,
         {"game_handler": game_handler, "host": True}),
        (r"/pws/(.*)", WebsocketHandler,
         {"game_handler": game_handler, "host": False})
    ]
    application = tornado.web.Application(urls, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(int(os.environ.get("PORT", 5000)), "0.0.0.0")
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
