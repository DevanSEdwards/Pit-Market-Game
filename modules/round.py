class Round:
    """Store data about a single round"""
    def __init__(self, tax=None, floor=None, ceiling=None):
        self.tax = tax
        self.floor = floor
        self.ceiling = ceiling
        self.trades = [] # List of trades