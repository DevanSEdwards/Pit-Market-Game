import os
import sys
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.web import RequestHandler
from tornado.log import enable_pretty_logging

class MainHandler(RequestHandler):
    def get(self):
        self.render("views/index.html")

def main():
    # Test if this module was called in debug mode, ie:
    #   > python main.py debug
    debug = len(sys.argv) > 1 and sys.argv[1].lower() == 'debug'
    
    if debug: enable_pretty_logging() # Log all GET, POST... requests
    application = tornado.web.Application(
        [(r"/", MainHandler),],
        debug=debug # Enable live changes to code
    )
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()