// Called in setup.js
function main() {
    document.getElementById("gameIdDisplay").innerText = state.gameId.toUpperCase();
    loadpage(state.inRound ? `round` : state.currentRound == -1 ? `warning` : `roundSettings`);
    window.setInterval(() => { incrementTimer(); shiftBlocks(); }, 1000);
    drawQrCode();
    initGameUrl();
    refresh();
    state.websocket.onmessage = handleMessage;
}

function handleMessage(event) {
    msg = JSON.parse(event.data);
    console.log(msg);

    switch (msg.type) {
        case `offer`:
            recieveNewOffer(msg.offerId, msg.isSeller, msg.price, msg.time);
            break;
        case `remove offer`:
            for (let i = 0; i < state.offers.length; i++)
                if (state.offers[i].offerId == msg.offerId)
                    state.offers.splice(i, 1);
            drawOfferList();
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
        case `announce trade`:
            state.trades.push(msg.price);
            drawTransactionList();
            break;
        case `end round`:
            loadpage(`roundSettings`);
            state.inRound = false;
            clearOfferList();
            break;
        case `end game`:
            draw(msg.sellDeck, msg.buyDeck);
            loadpage(`endGame`);
            break;
        case `remove offer`:
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