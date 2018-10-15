// Called in setup.js
function main() {
    document.getElementById("gameIdDisplay").innerText = state.gameId.toLowerCase();
    loadpage(state.inRound ? `round` : state.currentRound == -1 ? `warning` : `roundSettings`);
    window.setInterval(() => { incrementTimer(); shiftBlocks(); }, 1000);
    refresh();
    state.websocket.onmessage = handleMessage;
}

function handleMessage(event) {
    msg = JSON.parse(event.data);
    console.log(msg);

    switch (msg.type) {
        case `offer`:
            break;
        case `start round`:
            state.inRound = true;
            state.roundTimer = msg.length;
            state.rounds.push(new Round(
                msg.length,
                msg.offerTimeLimit,
                msg.tax,
                msg.ceiling,
                msg.floor
            ));
            refresh();
            loadpage(`round`);
            break;
        case `end round`:
            loadpage(`roundSettings`);
            state.inRound = false;
            break;
        case `end game`:
            loadpage(`endGame`);
            break;
    }
}

function refresh() {
    initDeckSettings();
    setRound(state.currentRound + 1);
    setTimer_s(state.roundTimer);
    drawTransactionList();
    drawOfferList();
}