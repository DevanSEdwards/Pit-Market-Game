var clientId = document.getElementById("clientId").innerText;
var isHost = document.getElementById("isHost").innerText == "true";
var offerIds = [];
var offerTimeout = 10000;

isHost ? host() : play();

function play() {
    var ws = new WebSocket(`wss://${window.location.host}/pws/${clientId}`);
    ws.onmessage = (event) => {
        msg = JSON.parse(event.data);
        console.log(msg);

        switch (msg.type) {
            case "card":
                document.getElementById("isSeller").innerText = msg.isSeller ? "Seller" : "Buyer";
                document.getElementById("cardValue").innerText = `Card: ${msg.value}`;
                isSeller = msg.isSeller;
                if (isSeller)
                {
                    document.getElementById("card").innerText = "Selling";
                }
                else
                {
                    document.getElementById("card").innerText = "Buying";
                }
                
                cardValue = msg.value;
                draw();
                break;
            case "offer":
                addOffer(msg, msg.isSeller ? !isSeller : isSeller, ws);
                break;
            case "start round":
                offerTimeout = msg["offer time limit"] * 1000;
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
            case "trade":
                if (msg.success) {
                    document.getElementById("btnPostOffer").disabled = true;
                    document.getElementById("btnPostOffer").value = `Traded at: ${msg.price.toString()}`;
                }
            case "announce trade":
                var announce = document.createElement("p");
                announce.innerHTML = `Successful Trade: ${msg.price.toString()}`;
                var tradeList = document.getElementById("tradeList");
                tradeList.appendChild(announce);
        }
    };
    document.getElementById("btnPostOffer").addEventListener("click", () => {
        ws.send(JSON.stringify({
            "type": "offer",
            "price": parseInt(document.getElementById("offerInput").value)
        }));
    });
}

function host() {
    var ws = new WebSocket(`wss://${window.location.host}/pws/${clientId}`);
    ws.onmessage = (event) => {
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
    document.getElementById("btnStartRound").addEventListener("click", () => {
        ws.send(JSON.stringify({
            "type": "start round"
        }));
    });
    document.getElementById("btnEndGame").addEventListener("click", () => {
        ws.send(JSON.stringify({
            "type": "end game"
        }));
    });
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