// Called in setup.js
function main() {
    initDeckSettings();
    loadpage(`deckSettings`);
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
