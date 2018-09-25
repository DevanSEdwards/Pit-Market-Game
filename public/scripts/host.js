state = {
    clientId: null,
    gameId: null,
    isHost: true,
    currentPage: null,
    deckSettings: {
        domain: 7,
        mean: 6,
        lowerLimit: 2
    },
    offers: [],
    rounds: [
        // {
        //     settings: {
        //         length: 120,
        //         offerTimeLimit: 10,
        //         tax: null,
        //         ceiling: null,
        //         floor: null
        //     },
        //     trades: []
        // }
    ]
}

function loadpage(page)
{
    pages = document.getElementById(`root`).children;
    pages.hidden = true;
    document.getElementById(`${page}Page`).hidden = false;
}



function main() {
    loadpage(`deckSettings`);
}

document.onload = main;