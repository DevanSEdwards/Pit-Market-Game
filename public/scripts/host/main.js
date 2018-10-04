// Called in setup.js
function main() {
    loadpage(`deckSettings`);
    initDeckSettings();

    state.websocket.onmessage = (event) => {
        msg = JSON.parse(event.data);
        console.log(msg);

        switch (msg.type) {
            case "offer":
                addOffer(msg, false, ws);
                break;
            case "start round":
                var timeRemaining = msg.length;
                var countInterval = window.setInterval(() => {
                    document.getElementById("roundCounter").innerText =
                        `Time: ${Math.floor(timeRemaining / 60).toString()}:${(timeRemaining % 60).toString().padStart(2, "0")}`;
                    if (timeRemaining-- == 0)
                        clearInterval(countInterval);
                }, 1000)
                for (var i = 0; i < offerIds.length; i++) {
                    document.getElementById(offerIds[i]).remove();
                }
                offerIds = [];
                break;
            case "end game":
                window.location.href = "/";
        }
    };
}

function addOffer(msg, addAcceptEvent, ws) {
    var tradeBtn = document.createElement("input");
    tradeBtn.id = msg.offerId;
    offerIds.push(msg.offerId);
    tradeBtn.type = "button";
    tradeBtn.value = msg.price;

    var fadeTime = 500;
    window.setTimeout(() => {
        fadeOut(tradeBtn, fadeTime);
        window.setTimeout(() => {
            offerIds.splice(offerIds.indexOf(msg.offerId), 1);
            tradeBtn.remove();
        }, fadeTime);
    }, offerTimeout - fadeTime);

    // Enable btn if appropriate
    if (addAcceptEvent)
        tradeBtn.addEventListener("click", () => {
            ws.send(JSON.stringify({
                "type": "accept",
                "offerId": msg.offerId
            }))
        })
    else
        tradeBtn.disabled = true;

    // Append btn to div
    if (msg.isSeller)
        document.getElementById("sellOffers").appendChild(tradeBtn);
    else
        document.getElementById("buyOffers").appendChild(tradeBtn);
}

