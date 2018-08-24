import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.web import RequestHandler

class MainHandler(RequestHandler):
    def get(self):
        self.render("views/index.html")

def main():
    application = tornado.web.Application(
        [(r"/", MainHandler),],
        debug=False
    )
    http_server = tornado.httpserver.HTTPServer(application)
    port = int(os.environ.get("PORT", 5000))
    http_server.listen(port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()