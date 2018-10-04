// Host state
// Different to player state

class State {
    constructor() {
        this.clientId = null;
        this.gameId = null;
        this.isHost = null;
        this.currentPage = null;
        this.deckSetting = {
            domain: 7,
            mean: 6,
            lowerLimit: 2
        };
        this.offers = []; // List of Offer objects
        this.rounds = []; // List of Round objects
        this.inRound = false;
        this.currentRound = 0;
        this.websocket = null;
    }
}

class Round {
    constructor(length, offerTimeLimit, tax, ceiling, floor) {
        this.length = length;
        this.offerTimeLimit = offerTimeLimit;
        this.tax = tax;
        this.ceiling = ceiling;
        this.floor = floor;
        this.trades = []; // List of integers (prices)
    }
}

class Offer {
    constructor(offerId, isSeller, price, time) {
        this.offerId = offerId;
        this.isSeller = isSeller;
        this.price = price;
        this.time = time;
    }
}