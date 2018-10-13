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
        this.roundTimer = 0;
        this.currentRound = 0;
        this.websocket = null;
    }
}

class Round {
    constructor(length = 120, offerTimeLimit = 10, tax = null, ceiling = null, floor = null) {
        this.length = length;
        this.offerTimeLimit = offerTimeLimit;
        this.tax = tax;
        this.ceiling = ceiling;
        this.floor = floor;
        this.trades = []; // List of integers (prices)
    }
}

// Lets you call state.card etc...
for (var key in Object.keys(new Round())) {
    Object.defineProperties(State, key, {
        get: () => { return this.rounds[this.currentRound][key]; },
        set: value => { this.rounds[this.currentRound][key] = value; }
    })
}