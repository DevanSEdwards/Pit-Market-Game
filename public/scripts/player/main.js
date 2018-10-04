// Called in setup.js
function main() {
    loadpage(`lobby`);

    state.websocket.onmessage = (event) => {
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
}
