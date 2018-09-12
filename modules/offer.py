class Offer():
    """Store and manage data about a single offer"""
    def __init__(self, offer_id, is_seller, price, time, player_id):
        self.offer_id = offer_id
        self.is_seller = is_seller
        self.price = price
        self.time = time
        self.player_id = player_id
        self.accepted = False
