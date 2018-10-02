var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");
// var ws = new WebSocket("ws://localhost:5000/WebSocket");
var _mouse = { x: 0, y: 0 };

/* VARIABLE STRUCTURES */
class Offer {

    init() {
        this.id = "";
        this.time = 0;
        this.price = 0;
    }
    constructor(stream) { init(); parseJSON(stream); }
    parseJSON(stream) { return; /* TODO */ }
}
class Transaction {
    init() {
        id = "";
        time = 0;
        price = 0;
    }
    constructor(stream) { init(); parseJSON(stream); }
    parseJSON(stream) { return; /* TODO */ }
}
var offer_lst = new Array();
var transaction_list = new Array();
/***********************/

/* GRAPH VARIABLES */

var graphBGColor = "white";
var graphBorderColor = "#AAAAAA";
var graphPointColor = "#333333";
var graphPointSize = 4;
var graphAxesColor = "#AAAAAA";
var graphTextColor = "#666666";
var graphGridColor = "#CCCCCC";
var graphFont = "16px Cabin"
var graphAxesWidth = 2;
var graphBorderWidth = 1;
var graphYAxisLabel = "Price";
var graphXAxisLabel = "Trading Periods";
var graphTitle = "Pitmarket Game Results";
var graphDrawGrid = true;
var graphPanelWidth = 800;
var graphPanelHeight = 600;
var graphYAxisMarkerLen = 10;
var graphOffsetX = 100;
var graphOffsetY = 75;
var graphYAxisBounds = 16;
var graphXAxisBounds = 12;
var graphWidth = graphPanelWidth - graphOffsetX * 2;
var graphHeight = graphPanelHeight - graphOffsetY * 2;
var graphYAxisIncrementLen = graphHeight / graphYAxisBounds;
var graphXAxisIncrementLen = graphWidth / graphXAxisBounds;

/* UI APPEARANCE VARIABLES */
var topPanelLabelFont = "Bold 30px Cabin";
var topPanelBGColor = "#333333";
var topPanelTextColor = "#FFFFFF";
var topPanelLabelsXOffset = 30;
var topPanelFieldsXOffset = 300;
var topPanelLabelsYOffset = 30;
var topPanelLabelsYSpacing = 40;
var cardBGColor = "#FFFFFF";
var cardWidth = 0.1422 * canvas.height;
var cardHeight = 1.1429 * cardWidth;
var cardTextColor = "#000000";
var cardFont = "Bold 24px Cabin";
var tradePanelLabelsYOffset = 30;
var tradePanelLabelsFont = "Bold 36px Cabin";
var offersPanelBGColor = "#EEEEEE";
var tradePanelBGColor = "#666666";

/* GAME & USER VARIABLES */
var roundNo = 1;
var isSeller; // Buyer = true, Seller = false
var cardValue = 5;
var profit = 0;

init()

function init() {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.scale(1, 1);
    window.requestAnimationFrame(draw);
}

function draw() {
    clearCanvas();
    drawBottomPanel();
    ctx.textAlign = "left";
    drawHotswapPanel();
    drawTopPanel();

    ctx.textAlign = "center";
    //drawGraph(canvas.width/2 - graphPanelWidth/2, canvas.height/2 - graphPanelHeight/2);

    window.requestAnimationFrame(draw);
}

function drawBottomPanel() {
    var x = 0;
    var y = canvas.height / 4 + canvas.height / 6;

    ctx.fillStyle = offersPanelBGColor;
    ctx.fillRect(x, y, (canvas.width / 2), canvas.height - y);
    ctx.fillStyle = tradePanelBGColor;
    ctx.fillRect(x + (canvas.width / 2), y, (canvas.width / 2), canvas.height - y);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, canvas.width, canvas.height / 18);

    // Text
    ctx.textAlign = "center";
    ctx.font = tradePanelLabelsFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Current Offers", x + (canvas.width / 4), y + tradePanelLabelsYOffset);
    ctx.fillText("Completed Trades", x + (canvas.width / 4) * 3, y + tradePanelLabelsYOffset);
}

function drawHotswapPanel() {
    var bgColor = "#cccccc";
    var textColor = "#000000";
    var promptFont = "Bold 60px Cabin";

    var x = 0;
    var y = canvas.height / 4;
    var height = canvas.height / 6;
    var width = canvas.width;

    ctx.beginPath();
    ctx.fillStyle = bgColor;
    ctx.rect(0, canvas.height / 4, width, height);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = textColor;
    ctx.font = promptFont;
    ctx.fillText("Post offer to buy", x + width / 6, y + height / 2);

    btn_offer.x = x + (width / 6) * 4;
    btn_offer.y = y + height / 3;
    btn_offer.w = 180;
    btn_offer.h = 40;
    drawButton(btn_offer.x, btn_offer.y, btn_offer.w, btn_offer.h, 'rgba(125, 230, 50, 255)', "Post Offer!");
}

function drawTopPanel() {
    ctx.fillStyle = topPanelBGColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height / 4);

    ctx.font = topPanelLabelFont;
    ctx.fillStyle = topPanelTextColor;
    ctx.fillText("Round: ", topPanelLabelsXOffset, topPanelLabelsYOffset);
    ctx.fillText(roundNo, topPanelFieldsXOffset, topPanelLabelsYOffset);
    ctx.fillText("Round time left: ", topPanelLabelsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing);
    ctx.fillText("01:59", topPanelFieldsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing);
    ctx.fillText("Profit made: ", topPanelLabelsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing * 2);
    ctx.fillText("$" + profit, topPanelFieldsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing * 2);
    ctx.fillText("Your card:", canvas.width - 150, 30);

    drawCard(canvas.width - 150, 50, isSeller);
}

function drawCard(x, y, selling) {
    ctx.textAlign = "center";

    ctx.beginPath();
    ctx.fillStyle = cardBGColor;
    ctx.rect(x, y, cardWidth, cardHeight);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = cardTextColor;
    ctx.font = cardFont;

    if (selling)
        ctx.fillText("Selling", x + cardWidth / 2, y + cardHeight / 4);
    else
        ctx.fillText("Buying", x + cardWidth / 2, y + cardHeight / 4);

    ctx.font = cardFont;
    ctx.fillText(cardValue, x + cardWidth / 2, y + cardHeight / 2 + 30);
}

function drawGraph(x, y) {
    var graphBtmLeftX = x + graphOffsetX;
    var graphBtmLeftY = y + graphOffsetY + graphHeight;

    function drawGraphPoint(x, y) {
        // only draw points if they are within the visible bounds of the graph
        if (x <= graphXAxisBounds && x >= 0 && y <= graphYAxisBounds && y >= 0) {
            var _x = graphBtmLeftX + x * graphXAxisIncrementLen;
            var _y = graphBtmLeftY - y * graphYAxisIncrementLen;
            ctx.beginPath();
            ctx.arc(_x, _y, graphPointSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = graphPointColor;
            ctx.fill();
        }
    }

    // draw background and border
    ctx.lineWidth = graphBorderWidth;
    ctx.strokeStyle = graphBorderColor;
    ctx.fillStyle = graphBGColor;
    ctx.fillRect(x, y, graphPanelWidth, graphPanelHeight);
    ctx.strokeRect(x, y, graphPanelWidth, graphPanelHeight);

    // draw grid
    if (graphDrawGrid) {
        ctx.strokeStyle = graphGridColor;
        // vertical lines
        for (i = 0; i < graphXAxisBounds + 1; i++) {
            ctx.beginPath()
            ctx.moveTo(x + graphOffsetX + (graphXAxisIncrementLen * i), y + graphOffsetY);
            ctx.lineTo(x + graphOffsetX + (graphXAxisIncrementLen * i), y + graphOffsetY + graphHeight);
            ctx.stroke();
        }
        // horizontal lines
        for (i = 0; i < graphYAxisBounds; i++) {
            ctx.beginPath()
            ctx.moveTo(x + graphOffsetX, y + graphOffsetY + (i * graphYAxisIncrementLen));
            ctx.lineTo(x + graphOffsetX + graphWidth, y + graphOffsetY + (i * graphYAxisIncrementLen));
            ctx.stroke();
        }
    }

    // draw axes
    ctx.lineWidth = graphAxesWidth;
    ctx.strokeStyle = graphAxesColor;
    ctx.beginPath();
    ctx.moveTo(x + graphOffsetX, y + graphOffsetY);
    ctx.lineTo(x + graphOffsetX, y + graphPanelHeight - graphOffsetY);
    ctx.lineTo(x + graphPanelWidth - graphOffsetX, y + graphPanelHeight - graphOffsetY);
    ctx.stroke();

    // draw labels
    ctx.fillStyle = graphTextColor;
    ctx.font = graphFont;
    ctx.fillText(graphTitle, x + graphPanelWidth / 2, y + 20);
    ctx.fillText(graphYAxisLabel, x + graphOffsetX - 50, y + graphPanelHeight / 2);
    ctx.fillText(graphXAxisLabel, x + graphPanelWidth / 2, graphBtmLeftY + 20);
    for (i = 0; i < graphYAxisBounds; i++) {
        ctx.fillText((graphYAxisBounds - i).toString(), x + graphOffsetX - 20, y + graphOffsetY + (i * graphYAxisIncrementLen));
        ctx.beginPath();
        ctx.moveTo(x + graphOffsetX, y + graphOffsetY + (i * ((graphHeight) / graphYAxisBounds)));
        ctx.lineTo(x + graphOffsetX + graphYAxisMarkerLen, y + graphOffsetY + (i * ((graphHeight) / graphYAxisBounds)));
        ctx.stroke();
    }

    // draw points
    drawGraphPoint(1, 9.7);
    drawGraphPoint(2, 7);
    drawGraphPoint(3, 3);
}

function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

function drawButton(x, y, width, height, colour, text) {
    var pad = 15
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(text, x + pad, y + height - pad);
}
function drawOffer(time, offer, isSeller) {
    if (isSeller) { ctx.fillStyle = "green"; }
    else { ctx.fillStyle = "blue"; }
    ctx.font = '25px Arial';
}


/* Button Controllers */
var btn_offer = { x: 0, y: 0, w: 0, h: 0 };
/**********************/

/* Event Listeners */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}
canvas.addEventListener("click", function (evt) { _mousePos = getMousePos(canvas, evt); }, false);
/*******************/

// /* Web Sockets */
// var hostId = document.getElementById("playerId").innerText;
// var ws = new WebSocket("ws://localhost:5000/pws/" + hostId);
// ws.onopen=function()
// {
//     ws.send(JSON.stringify({
//         "type": "offer",
//         "price": 5
//     }));
// };
// ws.on_message=function(evt)
// {
//     var stream = evt.data;
//     // Recieve Offer
//     offer_lst.push(new Offer(stream));
//     // Recieve Transaction
//     transactions_lst.push(new Transaction(stream));
//     // Recieve Offer Confirm
// };
// function sendDataToServer(message) { 
//     console.log("#====== Sending data... ======#    ");
//     console.log(message);
//     if(!ws.write_message(message))
//     {
//         console.log("#====== Sending Failed! ======#");
//     }
// }
// ws.on_close()=function() { window.location.href ="/index.html"; }
// function sendOffer(player, time, value)
// {
//     var message = "{type: 'offer', playerID: " + player + ", time: " + time + ", offer: " + value + "};"
//     sendDataToServer(message);
// }
// function sendTransation(time, offerID, playerID)
// {
//     var message = "{playerID: " + player + ", time: " + time + ", offer: " + value + "};"
//     sendDataToServer(message);
// }
// /***************/