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
        this.offers = [];
        this.rounds = [
            // settings = {
            //     length: 120,
            //     offerTimeLimit: 10,
            //     tax: null,
            //     ceiling: null,
            //     floor: null
            // },
            // trades: []            
        ];
        this.websocket = null;
    }
}