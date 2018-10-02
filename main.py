import os
import sys
import json
import inspect
import tornado.httpserver
import tornado.ioloop
import tornado.web
import datetime
from react import jsx
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
        arg = self.get_argument("game", default="")

        now = datetime.datetime.now()
        cookie_expiry = now + datetime.timedelta(minutes=60)
        client_id = self.get_cookie("clientId")

        # Hosting a new game (/?game=host)
        if arg == "host":
            if client_id is None or not self.game_handler.valid_id(client_id, None, True):
                host_id, game_id = self.game_handler.new_game()
                self.set_cookie("clientId", host_id, expires=cookie_expiry)
                self.set_cookie("gameId", game_id, expires=cookie_expiry)
                self.set_cookie("isHost", "true", expires=cookie_expiry)
            self.render("views/host.html")
        # Attempting to join a game (/?game=GAMEID)
        elif len(arg) == 6 and arg.isalnum():
            if not self.game_handler.valid_id(client_id, arg, False):
                self.clear_all_cookies()
                self.redirect("/")
                return
            if client_id is None:
                player_id = self.game_handler.add_player(arg)
                if player_id == None:
                    self.render("views/index.html")
                    return
                self.set_cookie("clientId", player_id, expires=cookie_expiry)
                self.set_cookie("gameId", arg, expires=cookie_expiry)
                self.set_cookie("isHost", "false", expires=cookie_expiry)
            self.render("views/player.html")
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
        "card settings": "hc_card_settings",
        "start round": "hc_start_round",
        "end round": "hc_end_round",
        "end game": "hc_end_game"
    }
    player_commands = {
        "offer": "pc_offer",
        "accept": "pc_accept"
    }

    def initialize(self, game_handler):
        """Store a reference to the game_handler instance and whether
        the client is a host.
        """
        self.game_handler = game_handler
        self.is_host = None
        self.commands = {"id"}

    def open(self):
        self.set_nodelay(True)

    def on_close(self):
        if self.is_host is None:
            return
        elif self.is_host:
            self.game.ws = None
        else:
            self.game.players[self.client_id].ws = None

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
                "message": "unknown type attribute"
            }))
            return

        # If this websocket is not associated with a user, associate it
        if self.is_host is None:
            self.client_id = msg["clientId"]
            self.is_host = msg["isHost"]
            self.commands, self.game = ((
                WebsocketHandler.host_commands,
                self.game_handler.add_host_ws(self)
            ) if self.is_host else (
                WebsocketHandler.player_commands,
                self.game_handler.add_player_ws(self)
            ))

            if self.game is None:
                self.is_host = None
                self.close()
            return

        # If client is a player, add the player_id to the message
        if not self.is_host:
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
        (r"/ws", WebsocketHandler, {"game_handler": game_handler})
    ]
    application = tornado.web.Application(urls, **settings)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(int(os.environ.get("PORT", 5000)), "0.0.0.0")
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
