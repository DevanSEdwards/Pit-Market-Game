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
var graphXAxisBounds = 32;
var graphWidth = graphPanelWidth - graphOffsetX * 2;
var graphHeight = graphPanelHeight - graphOffsetY * 2;
var graphYAxisIncrementLen = graphHeight / graphYAxisBounds;
var graphXAxisIncrementLen = graphWidth / graphXAxisBounds;
var graphPointConnectColor = "#AAAAAA";
var graphEquilibriumLineColor = "black";
var graphDashSettings = [2, 5];
var graphTradesOffset = graphXAxisIncrementLen * 8;
var graphSLineColor = "blue";
var graphDLineColor = "red";

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

    var equilibriumValue = 6;    

    function drawGraphPoint(x, y) {
        // only draw points if they are within the visible bounds of the graph
        if (x <= graphXAxisBounds && x >= 0 && y <= graphYAxisBounds && y >= 0) {
            var _x = graphBtmLeftX + graphTradesOffset + x * graphXAxisIncrementLen;
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
            __x = graphBtmLeftX + graphTradesOffset + points[i-1].x * graphXAxisIncrementLen;
            __y = graphBtmLeftY - points[i-1].y * graphYAxisIncrementLen;

            x_ = graphBtmLeftX + graphTradesOffset + points[i].x * graphXAxisIncrementLen;
            y_ = graphBtmLeftY - points[i].y * graphYAxisIncrementLen;

            if (points[i].p == points[i-1].p)
            {
                ctx.strokeStyle = graphPointConnectColor;
                ctx.beginPath();
                ctx.moveTo(__x, __y);
                ctx.lineTo(x_, y_);
                ctx.stroke();
            }

            if (points[i-1].p != points[i].p || i == 1)
            {
                console.log("test");
                ctx.fillStyle = "black";
                ctx.fillText(points[i].p, x_, graphBtmLeftY - equilibriumValue * graphYAxisIncrementLen * 2);
            }
        }
        // draw points
        for (i = 0; i < points.length; i++)
            drawGraphPoint(points[i].x, points[i].y)   
    }

    function drawSD(s, d)
    {
        for (i = 1; i < s.length; i++)
        {
            __x = graphBtmLeftX + (i-1)*graphXAxisIncrementLen;
            __y = graphBtmLeftY - s[i-1]*graphYAxisIncrementLen;

            x_ = graphBtmLeftX + i*graphXAxisIncrementLen;
            y_ = graphBtmLeftY - s[i]*graphYAxisIncrementLen;

            ctx.strokeStyle = graphSLineColor;
            ctx.beginPath();
            ctx.moveTo(__x, __y);
            ctx.lineTo(x_, __y);
            ctx.lineTo(x_, y_);
            ctx.stroke();

            ctx.fillStyle = graphSLineColor;
            if (i == s.length - 1)
                ctx.fillText("S", x_, y_ - graphYAxisIncrementLen/2,);
        }

        for (i = 1; i < d.length; i++)
        {
            __x = graphBtmLeftX + (i-1)*graphXAxisIncrementLen;
            __y = graphBtmLeftY - d[i-1]*graphYAxisIncrementLen;

            x_ = graphBtmLeftX + i*graphXAxisIncrementLen;
            y_ = graphBtmLeftY - d[i]*graphYAxisIncrementLen;

            ctx.strokeStyle = graphDLineColor;
            ctx.beginPath();
            ctx.moveTo(__x, __y);
            ctx.lineTo(x_, __y);
            ctx.lineTo(x_, y_);
            ctx.stroke();

            ctx.fillStyle = graphDLineColor;
            if (i == d.length - 1)
                ctx.fillText("D", x_, y_ + graphYAxisIncrementLen/2,);
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

    // draw equilibrium line
    ctx.strokeStyle = graphEquilibriumLineColor;
    ctx.setLineDash(graphDashSettings);
    ctx.beginPath();
    ctx.moveTo(graphBtmLeftX + graphTradesOffset + graphXAxisIncrementLen, y + graphBtmLeftY - equilibriumValue*graphYAxisIncrementLen);
    ctx.lineTo(graphBtmLeftX + graphWidth, y + graphBtmLeftY - equilibriumValue*graphYAxisIncrementLen);
    ctx.stroke();
    ctx.setLineDash([0, 0]);

    // draw points
    points = [  {x:1, y:2, p:1}, {x:2, y:3, p:1}, {x:4, y:7, p:1},
                {x:5, y:2, p:2}, {x:6, y:3, p:2}, {x:7, y:7, p:2}];

    sCards = [2, 2, 3, 4, 5, 6, 6, 7, 8];
    dCards = [10, 10, 9, 8, 7, 6, 6, 5, 4]; 

    drawPoints(points);
    drawSD(sCards, dCards);
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