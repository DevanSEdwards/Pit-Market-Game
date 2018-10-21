class PlayerStat:
    """Store data about a player for a single round"""
    
    def __init__(self, card, is_seller, trade_price):
        self.card = card
        self.is_seller = is_seller
        self.trade_price = trade_price
    
    def __repr__(self):
        return str(self.__dict__)