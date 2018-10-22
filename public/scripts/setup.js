// Send our identity to the server and setup a state object



var state = new State();

// Syntactic sugar for round properties
let keys = Object.keys(new Round());
for (let i = 0; i < keys.length; i++) {
    Object.defineProperty(state, keys[i], {
        get: () => state.currentRound >= 0 ? state.rounds[state.currentRound][keys[i]] : null,
        set: value => state.currentRound >= 0 ? state.rounds[state.currentRound][keys[i]] = value : null
    });
}

function send(msg) {
    console.log(msg);
    state.websocket.send(JSON.stringify(msg));
}

// To be used in main.js
function loadpage(page) {
    pages = document.getElementById(`root`).children;
    for (let p = 0; p < pages.length; p++)
        pages[p].style.display = `none`;

    document.getElementById(`${page}Page`).style.display = `block`;
}

function getCookie(cname) {
    var name = `${cname}=`;
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(`;`);
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ` `)
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return ``;
}

function storeCookieData() {
    // Add cookie data to state
    state.gameId = getCookie(`gameId`);
    state.isHost = getCookie(`isHost`);
    state.clientId = getCookie(`clientId`);
}

function sendCookieData() {
    // Send an id message
    storeCookieData();
    send({
        type: `id`,
        gameId: state.gameId,
        isHost: state.isHost,
        clientId: state.clientId
    });
}

function setState(newState) {
    // Set the state to the values of the incoming state object
    for (var property in newState)
        if (newState.hasOwnProperty(property) && property != `type`)
            state[property] = newState[property];
    console.log(state);
    // Call the main function from main.js
    main();
}

// - Run --------------------------------------------------------------

// Open a websocket
state.websocket = new WebSocket(`wss://${window.location.host}/ws`);
// Once the websocket is open send an id message
state.websocket.onopen = sendCookieData;
// Expect a state message back
state.websocket.onmessage = event => {
    let msg = JSON.parse(event.data);
    if (msg.type === `state`)
        setState(msg);
}
// If the websocket is closed redirect to index
state.websocket.onclose = () => {
    console.log("websocket closed");
};

// --------------------------------------------------------------------