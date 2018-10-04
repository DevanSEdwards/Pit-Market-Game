// Called in setup.js
function main() {
    loadpage(`lobby`);
    state.websocket.onmessage = handleMessage;
}

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
            break;
        case `end round`:
            loadpage(`lobby`);
            state.inRound = false;
            break;
        case `end game`:
            window.location.replace(`/`);
            break;
    }
};