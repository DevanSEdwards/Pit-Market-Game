// Player state
// Different to host state

class State {
    constructor() {
        this.clientId = null;
        this.gameId = null;
        this.isHost = null;
        this.currentPage = null;
        this.profit = 0;
        this.offers = []; // List of Offer objects
        this.rounds = []; // List of Round objects
        this.inRound = false;
        this.currentRound = -1;
        this.isSeller = true;
        this.websocket = null;
    }
}

class Round {
    constructor(length, offerTimeLimit, tax, ceiling, floor, card, isSeller) {
        this.length = length;
        this.offerTimeLimit = offerTimeLimit;
        this.tax = tax;
        this.ceiling = ceiling;
        this.floor = floor;
        this.tradePrice = null;
        this.card = card;
        this.isSeller = isSeller;
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