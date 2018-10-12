var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

// graph appearance
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
var graphPointConnectColor = "#AAAAAA";

init()

function init() {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.scale(1, 1);
    window.requestAnimationFrame(draw);
}

function draw() {
    clearCanvas();
    ctx.textAlign = "center";
    drawGraph(canvas.width/2 - graphPanelWidth/2, canvas.height/2 - graphPanelHeight/2);

    window.requestAnimationFrame(draw);
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

    function drawDeck(cards)
    {

    }

    function drawPoints(points)
    {
        // draw connections between points
        for (i = 1; i < points.length; i++)
        {
            if (points[i].p == points[i-1].p)
            {
                __x = graphBtmLeftX + points[i-1].x * graphXAxisIncrementLen;
                __y = graphBtmLeftY - points[i-1].y * graphYAxisIncrementLen;

                x_ = graphBtmLeftX + points[i].x * graphXAxisIncrementLen;
                y_ = graphBtmLeftY - points[i].y * graphYAxisIncrementLen;

                ctx.strokeStyle = graphPointConnectColor;
                ctx.beginPath();
                ctx.moveTo(__x, __y);
                ctx.lineTo(x_, y_);
                ctx.stroke();
            }
        }
        // draw points
        for (i = 0; i < points.length; i++)
            drawGraphPoint(points[i].x, points[i].y)   
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
    ctx.fillText("Quantity", x + graphOffsetX + 40, y + graphPanelHeight - graphOffsetY + 20);
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

    points = [  {x:1, y:2, p:1}, {x:2, y:3, p:1}, {x:4, y:7, p:1},
                {x:5, y:2, p:2}, {x:6, y:3, p:2}, {x:7, y:7, p:2}];

    drawPoints(points);
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