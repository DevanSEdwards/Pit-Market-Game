class Round:
    """Store data about a single round"""
    def __init__(self, length, offerTimeLimit, tax, ceiling, floor):
        self.length = length
        self.offerTimeLimit = offerTimeLimit
        self.tax = tax
        self.ceiling = ceiling
        self.floor = floor
        self.trade = [] # List of trades