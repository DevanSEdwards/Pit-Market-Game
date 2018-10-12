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
            // TODO: Append round state to round
            var len = msg.length;
            var lim = msg.offerTimeLimit;
            var tax = msg.tax;
            var ceiling = msg.ceiling;
            var floor = msg.floor;

            state.rounds.Append(new Round(len, lim, tax, ceiling, floor, /*card*/null, state.isSeller));
            setRound(state.rounds.length);
            setTimer_s(len);
            break;
        case `end round`:
            loadpage(`lobby`);
            state.inRound = false;
            break;
        case `end game`:
            loadpage(`endGame`);
            break;
    }
};