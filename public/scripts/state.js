export default class State 
{
    clientId = null;
    gameId = null;
    isHost = null;
    currentPage = null;
    deckSetting = {
        domain: 7,
        mean: 6,
        lowerLimit: 2
    };
    offers = [];
    rounds = [
        // settings = {
        //     length: 120,
        //     offerTimeLimit: 10,
        //     tax: null,
        //     ceiling: null,
        //     floor: null
        // },
        // trades: []            
    ];
    websocket = null;
}