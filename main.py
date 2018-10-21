import os
import sys
import json
import inspect
import tornado.httpserver
import tornado.ioloop
import tornado.web
import datetime
from tornado import websocket
from tornado.web import RequestHandler
from modules.game_handler import GameHandler
from modules.trade_exception import TradeError
if __debug__:
    from tornado.log import enable_pretty_logging
    from termcolor import cprint


def file_get_contents(filename):
    """
    Read the contents of a file.
    
    @param filename: the name of the file to be read.
    @return: the contents of the file.
    """
    with open(filename) as f:
        return f.read()

# Templating Values
host_pages = {"warning", "deckSettings", "endGame", "round", "roundSettings"}
player_pages = {"endGame", "round", "lobby"}
credit_names = {
    'Wesley': 'Billingham',
    'Alfred': 'Burgess',
    'Devan': 'Edwards',
    'Jayden': 'Kur',
    'Timothy': 'Wise',
    'Brave': 'Ziazan'
}

class MainHandler(RequestHandler):
    """
    Class to handle GET requests.    
    """

    def initialize(self, game_handler):
        """
        Store a reference to a game handler instance.
        
        @param: game_handler: the game handler to be referenced. 
        """
        self.game_handler = game_handler

    def get(self):
        """
        Process a get request.
        """
        arg = self.get_argument("game", default="")

        host_template = {page: file_get_contents("./public/html/host/" + page + ".html") for page in host_pages}
        player_template = {page: file_get_contents("./public/html/player/" + page + ".html") for page in player_pages}
        
        now = datetime.datetime.now()
        cookie_expiry = now + datetime.timedelta(minutes=60)
        client_id = self.get_cookie("clientId", "")

        # Hosting a new game (/?game=host)
        if arg == "host":
            if client_id == "" or not any(client_id == game.host_id for game in self.game_handler.games):
                host_id, game_id = self.game_handler.new_game()
                self.set_cookie("clientId", host_id, expires=cookie_expiry)
                self.set_cookie("gameId", game_id, expires=cookie_expiry)
                self.set_cookie("isHost", "true", expires=cookie_expiry)
            self.render("views/host.html", **host_template)
        # Attempting to join a game (/?game=GAMEID)
        elif len(arg) == 6 and arg.isalnum():
            arg = str.upper(arg)
            # Check for valid gameId
            if not any(arg == game.game_id for game in self.game_handler.games):
                self.clear_all_cookies()
                self.redirect("/")
                return
            if client_id == "" or not any(client_id in game.players.keys() for game in self.game_handler.games):
                player_id = self.game_handler.add_player(arg)
                if player_id == None:
                    self.render("views/index.html")
                    return
                self.set_cookie("clientId", player_id, expires=cookie_expiry)
            self.set_cookie("gameId", arg, expires=cookie_expiry)
            self.set_cookie("isHost", "false", expires=cookie_expiry)
            self.render("views/player.html", **player_template)
        # Render main page (/)
        else:
            self.render("views/index.html", credits=credit_names)


class WebsocketHandler(websocket.WebSocketHandler):
    """
    Class to handle incoming messages during a game.

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
        "end game": "hc_end_game",
        "send email": "hc_send_email"
    }
    player_commands = {
        "offer": "pc_offer",
        "accept": "pc_accept"
    }

    def initialize(self, game_handler):
        """
        Store a reference to the game_handler instance and whether
        the client is a host.
        
        @param game_handler: the game handler to be referenced. 
        """
        self.game_handler = game_handler
        self.is_host = None
        self.commands = {"id"}

    def open(self):
        self.set_nodelay(True)
	
    def on_close(self):
        """
        Close the connections to the host and players. 
        """
        if self.is_host is None:
            return
        elif self.is_host:
            self.game.ws = None
        else:
            self.game.players[self.client_id].ws = None

    def on_message(self, message):
        """
        Process a message, and execute the corresponding method in Game. 
        """
        msg = json.loads(message)
        cprint(msg, 'grey' if self.is_host is None else 'yellow' if self.is_host else 'red', 'on_white')
        # Check msg contains a type attribute
        if "type" not in msg:
            self.write_message(json.dumps({
                "type": "error",
                "message": "no type attribute"
            }))
            return
        # If type is unknown send an error message
        if msg["type"] not in self.commands:
            print("Bad Type")
            self.write_message(json.dumps({
                "type": "error",
                "message": "unknown type attribute"
            }))
            return

        # If this websocket is not associated with a user, associate it
        if self.is_host is None:
            self.client_id = msg["clientId"]
            self.is_host = str.lower(msg["isHost"]) == "true"
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
            self.write_message(json.dumps({
                "type": "error",
                "message": error.message
            }))

def main():
    """
    Main method to be called once at the beginning of the program. 
    """
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
