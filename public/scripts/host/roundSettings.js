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
    new QRCode(document.getElementById(`qrcode`), `${window.location.href}/?game=${state.gameId}`);
}

function submitRoundSettings() {
    var roundLength = document.getElementById("roundLength");
    var tradeLength = document.getElementById("tradeLength");

    state.websocket.send(JSON.stringify({
        type: "start round",
        length: parseInt(roundLength.options[roundLength.selectedIndex].value),
        offerTimeLimit: parseInt(tradeLength.options[tradeLength.selectedIndex].value),
        tax: parseInt(document.getElementById("taxInput").value),
        ceiling: parseInt(document.getElementById("ceilInput").value),
        floor: parseInt(document.getElementById("floorInput").value)
    }));
}

function submitEndGame() {
    state.websocket.send(JSON.stringify({ type: "end game" }));
}