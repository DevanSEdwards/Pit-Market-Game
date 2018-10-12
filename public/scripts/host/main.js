// Called in setup.js
function main() {
    initDeckSettings();
    document.getElementById("gameIdDisplay").innerText = state.gameId.toLowerCase();
    loadpage(state.inRound ? `round` : state.currentRound == 0 ? `warning` : `roundSettings`);
    state.websocket.onmessage = handleMessage;
}

function handleMessage(event) {
    msg = JSON.parse(event.data);
        console.log(msg);

        switch (msg.type) {
            case `offer`:
                break;
            case `start round`:
                loadpage(`round`);
                state.inRound = true
                setTimer_s(msg.length);
                break;
            case `end round`:
                loadpage(`roundSettings`);
                state.inRound = false;
                break;
            case `end game`:
                window.location.replace(`/`);
                break;
        }
}
