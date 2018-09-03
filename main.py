import os
import sys
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado import websocket
from tornado.web import RequestHandler
from tornado.log import enable_pretty_logging

class MainHandler(RequestHandler):
    def get(self):
        self.render("views/index.html")

def main():
    # Check if this module was called in debug mode, ie:
    #   > python main.py debug
    debug = len(sys.argv) > 1 and sys.argv[1].lower() == 'debug'
    # Log all GET, POST... requests
    if debug: enable_pretty_logging()

    application = tornado.web.Application([
        (r"/", MainHandler)],
        # Enable live changes to code
        debug=debug
    )
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
