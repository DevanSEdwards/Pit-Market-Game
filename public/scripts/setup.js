// Send our identity to the server and create a state object

var state = new State();

function loadpage(page) {
    pages = document.getElementById(`root`).children;
    pages.hidden = true;
    document.getElementById(`${page}Page`).hidden = false;
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
    state.gameId = getCookie(`gameId`);
    state.isHost = getCookie(`isHost`);
    state.clientId = getCookie(`clientId`);
}

function sendCookieData() {
    storeCookieData();
    state.websocket.send(JSON.stringify({
        type: `id`,
        gameId: state.gameId,
        isHost: state.isHost,
        clientId: state.clientId
    }));
}

state.websocket = new WebSocket(`ws://${window.location.host}/ws`);
state.websocket.onopen = sendCookieData;
state.websocket.onclose = () => { window.location.replace(`/`); };