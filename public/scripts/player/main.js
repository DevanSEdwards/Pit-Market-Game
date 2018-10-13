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
        case `card`:
            // document.getElementById(`isSeller`).innerText = msg.isSeller ? `Seller` : `Buyer`;
            // document.getElementById(`cardValue`).innerText = `Card: ${msg.value}`;
            // isSeller = msg.isSeller;
            // if (isSeller) {
            //     document.getElementById(`card`).innerText = `Selling`;
            // }
            // else {
            //     document.getElementById(`card`).innerText = `Buying`;
            // }

            // cardValue = msg.value;
            // draw();
            break;
        case `offer`:
            recieveNewOffer(msg.offerId, msg.isSeller, msg.price, msg.time);
            break;
        case `trade`:
            // if (msg.success) {
            //     document.getElementById(`btnPostOffer`).disabled = true;
            //     document.getElementById(`btnPostOffer`).value = `Traded at: ${msg.price.toString()}`;
            // }
            break;
        case `announce trade`:
            // var announce = document.createElement(`p`);
            // announce.innerHTML = `Successful Trade: ${msg.price.toString()}`;
            // var tradeList = document.getElementById(`tradeList`);
            // tradeList.appendChild(announce);
            break;
        case `start round`:
            loadpage(`round`);
            state.inRound = true
            state.rounds.append(new Round(
                msg.length,
                msg.offerTimeLimit,
                msg.tax,
                msg.ceiling,
                msg.floor,
                msg.card,
                msg.isSeller
            ));
            setRound(state.currentRound + 1);
            setTimer_s(msg.length);
            break;
        case `end round`:
            loadpage(`lobby`);
            state.inRound = false;
            state.currentRound++;
            break;
        case `end game`:
            loadpage(`endGame`);
            break;
    }
};