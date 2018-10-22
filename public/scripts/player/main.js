// Called in setup.js
function main() {
    loadpage(state.inRound ? `round` : `lobby`);
    window.setInterval( function() { incrementTimer(); shiftBlocks(); }, 1000 );
    document.getElementById("gameIdDisplay").innerText = state.gameId.toUpperCase();
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
        case `trade`:
            if (msg.success) {
                state.tradePrice = msg.price;
                setTrading(false);
                document.getElementById(`btnPostOffer`).classList.add('btnTraded');
            }
            displayScore()
            break;
        case `announce trade`:
            state.trades.push(msg.price);
            drawTransactionList();
            break;
        case `start round`:
            document.getElementById(`btnPostOffer`).classList.remove('btnTraded');
            state.inRound = true
            state.roundTimer = msg.length
            state.rounds.push(new Round(
                msg.length,
                msg['offer time limit'],
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
            clearOfferList();   
            break;
        case `end game`:
            window.location.assign(`/`);
            // draw(msg.sellDeck, msg.buyDeck);
            // loadpage(`endGame`);
            break;
    }
};

function refresh() {
    displayScore();
    setRound(state.currentRound + 1);
    setTimer_s(state.roundTimer);
    setTrading(state.tradePrice == null && state.isSeller != null);
    setCard(state.card, state.isSeller);
    drawTransactionList();
    drawOfferList();
}