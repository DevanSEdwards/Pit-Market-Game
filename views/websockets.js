var clientId = document.getElementById("clientId").innerText;
var isHost = document.getElementById("isHost").innerText == "true";

isHost ? host() : play();

function play() {
    var ws = new WebSocket("ws://localhost:5000/pws/" + clientId);
    ws.onmessage = function(event) {
        msg = JSON.parse(event.data);
        console.log(msg);
        
        switch(msg.type) {
            case "card":
                isSeller = msg.isSeller;
                cardValue =  msg.value;
                draw();
                break;
        }
    };
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
}
