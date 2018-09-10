class Player():
    """Store and manage data about a single offer"""
    def __init__(self, offer_id, type,  is_seller, price, time, player_id):
        self.offer_id = offer_id
        self.type = type
        self.is_seller = is_seller
        self.price = price
        self.time = time
        self.player_id = player_id
