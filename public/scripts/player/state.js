// Player state
// Different to host state

class State {
    constructor() {
        this.clientId = null;
        this.gameId = null;
        this.isHost = null;
        this.offers = []; // List of Offer objects
        this.rounds = []; // List of Round objects
        this.inRound = false;
        this.roundTimer = 0;
        this.websocket = null;
    }

    get currentRound() { return this.rounds.length - 1; }
    get profit() { 
        return this.rounds
            .map(r => r.tradePrice === null ? 0 : r.isSeller ? r.tradePrice - r.card - r.tax : r.card - r.tradePrice)
            .reduce((a, b) => a + b, 0);
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