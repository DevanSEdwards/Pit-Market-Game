function inputFilter(arg) {

    var max = parseInt(arg.max);
    var min = parseInt(arg.min);

    if (parseInt(arg.value) < min) {
        arg.value = min;
    }
    else if (parseInt(arg.value) > max) {
        arg.value = max;
    }
}

function resetEmptyValue(arg) {
    if (arg.value == "") {
        arg.value = 0;
    }
}

function drawQrCode() {
    new QRCode(document.getElementById(`qrcode`), {
        text: `${window.location.href}/?game=${state.gameId}`,
        width: 114,
        height: 114,
        colorDark : `#000000`,
        colorLight : `#ffffff`,
        correctLevel : QRCode.CorrectLevel.L
    });
}

function submitRoundSettings() {
    var roundLength = document.getElementById("roundLength");
    var tradeLength = document.getElementById("tradeLength");

    state.websocket.send(JSON.stringify({
        type: "start round",
        length: parseInt(roundLength.options[roundLength.selectedIndex].value),
        offerTimeLimit: parseInt(tradeLength.options[tradeLength.selectedIndex].value),
        tax: parseInt(document.getElementById("taxInput").value),
        ceiling: document.getElementById(`chkCeil`).checked ? parseInt(document.getElementById("ceilInput").value) : null,
        floor: document.getElementById(`chkFloor`).checked ? parseInt(document.getElementById("floorInput").value) : null
    }));
}

function submitEndGame() {
    state.websocket.send(JSON.stringify({ type: "end game" }));
}

function submitSendEmail() {
    state.websocket.send(JSON.stringify({ 
        type: "send email",
        address: document.getElementById("emailAddress").value
 }));

function priceLimitChk(isCeiling) {
    if (isCeiling) {
        document.getElementById(`chkFloor`).checked = false;
    }
    else {
        document.getElementById(`chkCeil`).checked = false;
    }
}