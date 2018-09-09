var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

/* Appearance variables */
var topPanelLabelFont = "Bold 30px Cabin";
var topPanelBGColor = "#333333";
var topPanelTextColor = "#FFFFFF";
var topPanelLabelsXOffset = 30;
var topPanelFieldsXOffset = 300;
var topPanelLabelsYOffset = 30;
var topPanelLabelsYSpacing = 40;
var cardBGColor = "#FFFFFF";
var cardWidth = 128;
var cardHeight = 160;
var cardTextColor = "#000000";
var cardFont = "Bold 24px Cabin";
var tradePanelLabelsYOffset = 30;
var tradePanelLabelsFont = "Bold 36px Cabin";
var buysellPanelBGColor = "#EEEEEE";
var tradePanelBGColor = "#666666";

/* Game variables */
roundNo = 1;

/* User variables */
var buyer = true; // Buyer = true, Seller = false
var cardValue = 5;
var profit = 0;

init()

function init()
{
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.scale(1, 1);
    window.requestAnimationFrame(draw);
}

function draw()
{   
    clearCanvas();
    drawBottomPanel();
    ctx.textAlign = "left";
    drawHotswapPanel();
    drawTopPanel();
     
    //drawGraph(c.width/2 - 800/2, 50);

    window.requestAnimationFrame(draw);
}

function drawBottomPanel()
{
    var x = 0;
    var y = canvas.height / 4 + canvas.height / 6;

    ctx.fillStyle = tradePanelBGColor;
    ctx.fillRect(x, y, canvas.width, canvas.height - y);
    ctx.fillStyle = buysellPanelBGColor;
    ctx.fillRect(x, y, canvas.width / 3, canvas.height - y);
    ctx.fillRect(canvas.width - canvas.width / 3, y, canvas.width / 3, canvas.height - y);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, canvas.width, canvas.height / 18);
    ctx.textAlign = "center";
    ctx.font = tradePanelLabelsFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Buying", x + canvas.width / 3 / 2, y + tradePanelLabelsYOffset);
    ctx.fillText("Selling", canvas.width - canvas.width / 3 / 2, y + tradePanelLabelsYOffset);
    ctx.fillText("Completed Trades", x + canvas.width / 2, y + tradePanelLabelsYOffset);
}

function drawHotswapPanel()
{
    var bgColor = "#cccccc";
    var textColor = "#000000";
    var promptFont = "Bold 60px Cabin";

    var x = 0;
    var y = canvas.height/4; 
    var height = canvas.height/6;
    var width = canvas.width;

    ctx.beginPath();
    ctx.fillStyle = bgColor;
    ctx.rect(0, canvas.height/4, width, height);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = textColor;
    ctx.font = promptFont;
    ctx.fillText("Post offer to buy", x + width/4, y + height/2);
}

function drawTopPanel()
{
    ctx.fillStyle = topPanelBGColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height/4);

    ctx.font = topPanelLabelFont;
    ctx.fillStyle = topPanelTextColor;
    ctx.fillText("Round: ", topPanelLabelsXOffset, topPanelLabelsYOffset);
    ctx.fillText(roundNo, topPanelFieldsXOffset, topPanelLabelsYOffset);
    ctx.fillText("Round time left: ", topPanelLabelsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing);
    ctx.fillText("1:59", topPanelFieldsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing);
    ctx.fillText("Profit made: ", topPanelLabelsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing*2);
    ctx.fillText("$" + profit, topPanelFieldsXOffset, topPanelLabelsYOffset + topPanelLabelsYSpacing*2);
    ctx.fillText("Your card:", canvas.width - 150, 30);

    drawCard(canvas.width - 150, 50, true);
}

function drawCard(x, y, buying)
{
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

    if (buying)
        ctx.fillText("Buying", x  + cardWidth / 2, y + cardHeight / 4);
    else
        ctx.fillText("Selling", x  + cardWidth / 2, y + cardHeight / 4);
    
    ctx.font = cardFont;
    ctx.fillText(cardValue, x  + cardWidth / 2, y + cardHeight / 2 + 30);
}

function drawGraph(x, y)
{
    var width = 800;
    var height = 600;

    var drawGrid = true;

    // Colors and fonts
    var backgroundColor = "white";
    var borderColor = "#AAAAAA";
    var pointColor = "#333333";
    var axisColor = "#AAAAAA";
    var labelColor = "#666666";
    var gridColor = "#CCCCCC";
    var labelFont = "Bold 12px Cabin"

    // Labels
    var yAxisLabel = "Price";
    var xAxisLabel = "Trading Periods";
    var title = "Pitmarket Game Results";

    var axisLineWidth = 2;
    var borderLineWidth = 1;

    var yAxisMarkersLen = 10;
    var graphPointSize = 4;
    var graphOffsetX = 50;
    var graphOffsetY = 75;
    var yAxisSegments = 16;
    var xAxisSegments = 12;
    var graphWidth = width - graphOffsetX*2;
    var graphHeight = height - graphOffsetY*2;
    var yAxisSegmentLen = graphHeight / yAxisSegments;
    var xAxisSegmentLen = graphWidth / xAxisSegments;

    var graphBtmLeftX = x + graphOffsetX;
    var graphBtmLeftY = y + graphOffsetY + graphHeight;

    function drawGraphPoint(x, y)
    {
        // only draw points if they are within the visible bounds of the graph
        if (x <= xAxisSegments && x >= 0 && y <= yAxisSegments && y >= 0)
        {
            var _x = graphBtmLeftX + x*xAxisSegmentLen;
            var _y = graphBtmLeftY - y*yAxisSegmentLen;
            ctx.beginPath();
            ctx.arc(_x, _y, graphPointSize, 0, 2 * Math.PI, false);
            ctx.fillStyle = pointColor;
            ctx.fill();
        }
    }

    // draw background and border
    ctx.lineWidth = borderLineWidth;
    ctx.strokeStyle = borderColor;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    
    // draw grid
    if (drawGrid)
    {
        ctx.strokeStyle = gridColor;
        // vertical lines
        for (i = 0; i < xAxisSegments + 1; i++)
        {
            ctx.beginPath()
            ctx.moveTo(x + graphOffsetX + (xAxisSegmentLen*i), y + graphOffsetY);
            ctx.lineTo(x + graphOffsetX + (xAxisSegmentLen*i), y + graphOffsetY + graphHeight);
            ctx.stroke();
        }
        // horizontal lines
        for (i = 0; i < yAxisSegments; i++)
        {
            ctx.beginPath()
            ctx.moveTo(x + graphOffsetX, y + graphOffsetY + (i*yAxisSegmentLen));
            ctx.lineTo(x + graphOffsetX + graphWidth, y + graphOffsetY + (i*yAxisSegmentLen));
            ctx.stroke();
        }
    }

    // draw axes
    ctx.lineWidth = axisLineWidth;
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    ctx.moveTo(x + graphOffsetX, y + graphOffsetY);
    ctx.lineTo(x + graphOffsetX, y + height - graphOffsetY);
    ctx.lineTo(x + width - graphOffsetX, y + height - graphOffsetY);
    ctx.stroke();

    // draw labels
    ctx.fillStyle = labelColor;
    ctx.font = labelFont;
    ctx.fillText(title, x + width/3, y + 20);
    ctx.fillText(yAxisLabel, x + 10, y + 30);
    ctx.fillText(xAxisLabel, x + width/3, y + height - 45); // fix these labels so they are centred properly
    for (i = 0; i < yAxisSegments; i++)
    {
        ctx.fillText((yAxisSegments-i).toString(), x + 30, y + graphOffsetY + (i*yAxisSegmentLen));
        ctx.beginPath();
        ctx.moveTo(x + graphOffsetX, y + graphOffsetY + (i*((graphHeight) / yAxisSegments)));
        ctx.lineTo(x + graphOffsetX + yAxisMarkersLen, y + graphOffsetY + (i*((graphHeight) / yAxisSegments)));
        ctx.stroke();
    }

    // draw points
    drawGraphPoint(1, 9.7);
    drawGraphPoint(2, 7);
    drawGraphPoint(3, 3);
}

function clearCanvas()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}