class Trade():
    """Store and manage data about a single offer"""

    def __init__(self, offer_id, price, time, buyer_id, seller_id):
        self.offer_id = offer_id
        self.price = price
        self.time = time
        self.buyer_id = buyer_id
        self.seller_id = seller_id
