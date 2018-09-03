import json
import random
import string
from uuid import uuid4

class GameHandler():
    """Store and manage a set of all games"""
    def __init__(self):
        self.games = set()