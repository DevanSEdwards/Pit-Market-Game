// Called in setup.js
function main() {
    loadpage(state.inRound ? `round` : `lobby`);
    window.setInterval( function() { incrementTimer(); shiftBlocks(); }, 1000 );
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
        case `trade`:
            if (msg.success) {
                state.tradePrice = msg.price;
                setTrading(false);
            }
            break;
        case `announce trade`:
            state.trades.push(msg.price);
            drawTransactionList();
            break;
        case `start round`:
            state.inRound = true
            state.rounds.push(new Round(
                msg.length,
                msg.offerTimeLimit,
                msg.tax,
                msg.ceiling,
                msg.floor,
                msg.card,
                msg.isSeller
            ));
            refresh();
            loadpage(`round`);
            break;
        case `end round`:
            state.inRound = false;
            loadpage(`lobby`);
            break;
        case `end game`:
            draw(msg.sellDeck, msg.buyDeck);
            loadpage(`endGame`);
            break;
    }
};

function refresh() {
    setRound(state.currentRound + 2);
    setTimer_s(state.roundTimer);
    setTrading(state.tradePrice == null && state.isSeller != null);
    setCard(state.card, state.isSeller);
    drawTransactionList();
    drawOfferList();
}