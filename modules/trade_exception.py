class TradeError(Exception):
    """Exception raised for errors in a trade"""
    
    def __init__(self, message):
        self.message = message
