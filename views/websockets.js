var clientId = document.getElementById("clientId").innerText;
var isHost = document.getElementById("isHost").innerText == "true";

isHost ? host() : play();

function play() {
    var ws = new WebSocket("ws://pit-market-game.herokuapp.com/pws/" + clientId);
    var offerIds = [];
    ws.onmessage = function(event) {
        msg = JSON.parse(event.data);
        console.log(msg);
        
        switch(msg.type) {
            case "card":
                document.getElementById("isSeller").innerText = msg.isSeller ? "Seller" : "Buyer";
                document.getElementById("cardValue").innerText = "Card: " + msg.value;
                isSeller = msg.isSeller;
                cardValue =  msg.value;
                draw();
                break;
            case "offer":
                var tradeBtn = document.createElement("input");
                tradeBtn.id = msg.offerId;
                offerIds.push(msg.offerId);
                console.log(offerIds);
                tradeBtn.type = "button";
                tradeBtn.value = msg.price;
                // Enable btn if appropriate
                if (msg.isSeller ? !isSeller : isSeller)
                    tradeBtn.addEventListener("click", function(){
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
                break;
            case "start round":
                for (var i = 0; i < offerIds.length; i++) {
                    document.getElementById(offerIds[i]).remove();
                }
                offerIds = [];
                break;
            case "end game":
                window.location.href = "/";
        } 
    };
    document.getElementById("btnPostOffer").addEventListener("click", function(){
        ws.send(JSON.stringify({
            "type": "offer",
            "price": parseInt(document.getElementById("offerInput").value)
        }));
    });
}

function host() {
    var ws = new WebSocket("ws://localhost:5000/hws/" + clientId);
    ws.onmessage = function(event) {
        msg = JSON.parse(event.data);
        console.log(msg);

    };
    document.getElementById("btnStartRound").addEventListener("click", function(){
        ws.send(JSON.stringify({
            "type": "start round"
        }));
    });
    document.getElementById("btnEndGame").addEventListener("click", function(){
        ws.send(JSON.stringify({
            "type": "end game"
        }));
    });
}
