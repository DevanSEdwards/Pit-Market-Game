var canvas = document.getElementById("graph_display");
var ctx = canvas.getContext("2d");

// graph appearance variables
var gBGColor = "white";
var gBorderColor = "rgb(192, 192, 192)";
var gPointColor = "black";
var gPointConnectColor = "rgb(192, 192, 192)";
var gPointSize = 4;
var gPointConnectWidth = 2;
var gAxesColor = "rgb(192, 192, 192)";
var gTextColor = "black";
var gGridColor = "rgb(230, 230, 230)";
var gFont = "16px Arial";
var gAxesWidth = 3;
var gBorderWidth = 3;
var gYAxisLabel = "Price";
var gXAxisLabel = "Trading Periods";
var gTitle = "Pitmarket Game Results";
var gDrawGrid = true;
var gGridLineWidth = 1;
var gPanelWidth = canvas.width;
var gPanelHeight = canvas.height;
var gYAxisMarkerLen = 10;
var gOffsetX = 100;
var gOffsetY = 75;
var gYAxisBounds = 16;
var gXAxisBounds = 32;
var gWidth = gPanelWidth - gOffsetX * 2;
var gHeight = gPanelHeight - gOffsetY * 2;
var gYAxisIncrementLen = gHeight / gYAxisBounds;
var gXAxisIncrementLen = gWidth / gXAxisBounds;
var gEquilibriumLineColor = "black";
var gEquilibriumLineWidth = 3;
var gDashSettings = [4, 6];
var gTradesOffset = gXAxisIncrementLen * 8;
var gSLineColor = "mediumturquoise";
var gDLineColor = "lightcoral";
var gSDLineWidth = 3;

var equilibriumValue = 0;

init()

function init() {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.scale(1, 1);
    // window.requestAnimationFrame(draw);
}

function draw(sellDeck, buyDeck) {
    equilibriumValue = state.deckSetting.mean;
    clearCanvas();
    ctx.textAlign = "center";
    drawGraph(
        sellDeck,
        buyDeck,
        canvas.width / 2 - gPanelWidth / 2,
        canvas.height / 2 - gPanelHeight / 2
    );

    // window.requestAnimationFrame(draw);
}

function drawGraph(sellDeck, buyDeck, x, y) {
    gYAxisBounds = Math.max(Math.max(...sellDeck), Math.max(...buyDeck)) + 5;
    gXAxisBounds = state.rounds.map(r => r.trades.length + 1).reduce((a, b) => a + b, 0) +
        Math.max(sellDeck.length, buyDeck.length) + 1;

    console.log(gYAxisBounds);
    console.log(gXAxisBounds);

    gXAxisIncrementLen = gWidth / gXAxisBounds;
    gYAxisIncrementLen = gHeight / gYAxisBounds;

    var graphBtmLeftX = x + gOffsetX;
    var graphBtmLeftY = y + gOffsetY + gHeight;

    

    function drawGraphPoint(x, y) {
        // only draw points if they are within the visible bounds of the graph
        // if (x <= gXAxisBounds && x >= 0 && y <= gYAxisBounds && y >= 0) {
            var _x = graphBtmLeftX + gTradesOffset + x * gXAxisIncrementLen;
            var _y = graphBtmLeftY - y * gYAxisIncrementLen;
            ctx.beginPath();
            ctx.arc(_x, _y, gPointSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = gPointColor;
            ctx.fill();
        // }
    }

    function drawPoints(points) {
        // draw connections between points
        for (i = 1; i < points.length; i++) {
            __x = graphBtmLeftX + gTradesOffset + i * gXAxisIncrementLen;
            __y = graphBtmLeftY - points[i - 1].price * gYAxisIncrementLen;

            x_ = graphBtmLeftX + gTradesOffset + (i + 1) * gXAxisIncrementLen;
            y_ = graphBtmLeftY - points[i].price * gYAxisIncrementLen;

            if (points[i].p == points[i - 1].p) {
                ctx.strokeStyle = gPointConnectColor;
                ctx.lineWidth = gPointConnectWidth;
                ctx.beginPath();
                ctx.moveTo(__x, __y);
                ctx.lineTo(x_, y_);
                ctx.stroke();
            }

            if (points[i - 1].p != points[i].p || i == 1) {
                ctx.fillStyle = "black";
                ctx.fillText(points[i].p, x_, graphBtmLeftY - equilibriumValue * gYAxisIncrementLen * 2);
            }
        }
        // draw points
        for (i = 0; i < points.length; i++)
            drawGraphPoint(i + 1, points[i].price)
    }

    function drawSD(s, d) {
        ctx.lineWidth = gSDLineWidth;
        for (i = 1; i < s.length; i++) {
            __x = graphBtmLeftX + (i - 1) * gXAxisIncrementLen;
            __y = graphBtmLeftY - s[i - 1] * gYAxisIncrementLen;

            x_ = graphBtmLeftX + i * gXAxisIncrementLen;
            y_ = graphBtmLeftY - s[i] * gYAxisIncrementLen;

            ctx.strokeStyle = gSLineColor;
            ctx.beginPath();
            ctx.moveTo(__x, __y);
            ctx.lineTo(x_, __y);
            ctx.lineTo(x_, y_);
            ctx.stroke();

            ctx.fillStyle = gSLineColor;
            if (i == s.length - 1)
                ctx.fillText("S", x_, y_ - gYAxisIncrementLen / 2);
        }

        for (i = 1; i < d.length; i++) {
            __x = graphBtmLeftX + (i - 1) * gXAxisIncrementLen;
            __y = graphBtmLeftY - d[i - 1] * gYAxisIncrementLen;

            x_ = graphBtmLeftX + i * gXAxisIncrementLen;
            y_ = graphBtmLeftY - d[i] * gYAxisIncrementLen;

            ctx.strokeStyle = gDLineColor;
            ctx.beginPath();
            ctx.moveTo(__x, __y);
            ctx.lineTo(x_, __y);
            ctx.lineTo(x_, y_);
            ctx.stroke();

            ctx.fillStyle = gDLineColor;
            if (i == d.length - 1)
                ctx.fillText("D", x_, y_ + gYAxisIncrementLen / 2);
        }
    }

    // draw background and border
    ctx.lineWidth = gBorderWidth;
    ctx.strokeStyle = gBorderColor;
    ctx.fillStyle = gBGColor;
    ctx.fillRect(x, y, gPanelWidth, gPanelHeight);
    ctx.strokeRect(x, y, gPanelWidth, gPanelHeight);

    // draw grid
    if (gDrawGrid) {
        ctx.strokeStyle = gGridColor;
        ctx.lineWidth = gGridLineWidth;
        // vertical lines
        for (i = 0; i < gXAxisBounds + 1; i++) {
            ctx.beginPath()
            ctx.moveTo(x + gOffsetX + (gXAxisIncrementLen * i), y + gOffsetY);
            ctx.lineTo(x + gOffsetX + (gXAxisIncrementLen * i), y + gOffsetY + gHeight);
            ctx.stroke();
        }
        // horizontal lines
        for (i = 0; i < gYAxisBounds; i++) {
            ctx.beginPath()
            ctx.moveTo(x + gOffsetX, y + gOffsetY + (i * gYAxisIncrementLen));
            ctx.lineTo(x + gOffsetX + gWidth, y + gOffsetY + (i * gYAxisIncrementLen));
            ctx.stroke();
        }
    }

    // draw axes
    ctx.lineWidth = gAxesWidth;
    ctx.strokeStyle = gAxesColor;
    ctx.beginPath();
    ctx.moveTo(x + gOffsetX, y + gOffsetY);
    ctx.lineTo(x + gOffsetX, y + gPanelHeight - gOffsetY);
    ctx.lineTo(x + gPanelWidth - gOffsetX, y + gPanelHeight - gOffsetY);
    ctx.stroke();

    // draw labels
    ctx.fillStyle = gTextColor;
    ctx.font = gFont;
    ctx.fillText("Cards", x + gOffsetX + 40, y + gPanelHeight - gOffsetY + 20);
    ctx.fillText(gTitle, x + gPanelWidth / 2, y + 20);
    ctx.fillText(gYAxisLabel, x + gOffsetX - 50, y + gPanelHeight / 2);
    ctx.fillText(gXAxisLabel, x + gPanelWidth / 2, graphBtmLeftY + 20);
    for (i = 0; i < gYAxisBounds; i++) {
        ctx.fillText((gYAxisBounds - i).toString(), x + gOffsetX - 20, y + gOffsetY + (i * gYAxisIncrementLen));
        ctx.beginPath();
        ctx.moveTo(x + gOffsetX, y + gOffsetY + (i * ((gHeight) / gYAxisBounds)));
        ctx.lineTo(x + gOffsetX + gYAxisMarkerLen, y + gOffsetY + (i * ((gHeight) / gYAxisBounds)));
        ctx.stroke();
    }

    // draw equilibrium line
    ctx.strokeStyle = gEquilibriumLineColor;
    ctx.lineWidth = gEquilibriumLineWidth;
    ctx.setLineDash(gDashSettings);
    ctx.beginPath();
    ctx.moveTo(graphBtmLeftX + gTradesOffset + gXAxisIncrementLen, y + graphBtmLeftY - equilibriumValue * gYAxisIncrementLen);
    ctx.lineTo(graphBtmLeftX + gWidth, y + graphBtmLeftY - equilibriumValue * gYAxisIncrementLen);
    ctx.stroke();
    ctx.setLineDash([0, 0]);

    let points = state.rounds
        .map((r, i) => r.trades.map((t) => ({ price: t, p: i })))
        .reduce((a, b) => a.concat(b), [])
        .sort((a, b) => a.p - b.p);
    console.log(points);
    drawPoints(points);
    drawSD(sellDeck, buyDeck);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawButton(x, y, width, height, colour, text) {
    var pad = 15
    ctx.fillStyle = colour;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText(text, x + pad, y + height - pad);
}