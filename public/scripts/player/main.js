// Called in setup.js
function main() {
    drawOfferList();
    loadpage(state.inRound ? `round` : `lobby`);
    setTimer_s(state.roundTimer);
    window.setInterval( function() { incrementTimer(); shiftBlocks(); }, 1000 );
    state.websocket.onmessage = handleMessage;
}

function setRound(round) { document.getElementById("info_round").innerHTML = String(round); }

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
            console.log(state.currentRound);
            setRound(state.currentRound + 1);
            setTimer_s(state.length);
            setTrading(true);
            loadpage(`round`);
            break;
        case `end round`:
            state.inRound = false;
            loadpage(`lobby`);
            break;
        case `end game`:
            loadpage(`endGame`);
            break;
    }
};