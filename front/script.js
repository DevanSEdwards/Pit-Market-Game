var c = document.getElementById("display");
var ctx = c.getContext("2d");

init()

function init()
{
    window.requestAnimationFrame(draw);
}

function draw()
{
    clearCanvas();
    drawTopPanel();
    drawHotswapPanel();
    drawBottomPanel();
    //drawGraph(c.width/2 - 800/2, 50);

    window.requestAnimationFrame(draw);
}

function drawBottomPanel()
{
    var bgColor = "#666666";
    var sidePanelColor = "#eeeeee";
    var labelFont = "24px Comic Sans Ms";

    var x = 0;
    var y = c.height / 4 + c.height / 6;

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, c.width, c.height - y);

    ctx.fillStyle = sidePanelColor;
    ctx.fillRect(x, y, c.width / 3, c.height - y);
    ctx.fillRect(c.width - c.width / 3, y, c.width / 3, c.height - y);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, c.width, c.height / 18);

    ctx.font = labelFont;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Buying", x + c.width / 3 / 2 - 30, y + 30);
    ctx.fillText("Selling", c.width - c.width / 3 / 2 - 30, y + 30);
    ctx.fillText("Completed Trades", x + c.width / 2 - 90, y + 30);
}

function drawHotswapPanel()
{
    var bgColor = "#cccccc";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, c.height / 4, c.width, c.height / 6 );
}

function drawTopPanel()
{
    var labelFont = "30px Comic Sans MS";
    var bgColor = "#333333";
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, c.width, c.height/4);
    ctx.fill();

    ctx.font = labelFont;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Round: ", 30, 30);
    ctx.fillText("1", 300, 30);
    ctx.fillText("Round time left: ", 30, 70);
    ctx.fillText("1:59", 300, 70);
    ctx.fillText("Profit made: ", 30, 110);
    ctx.fillText("$0", 300, 110);

    ctx.fillText("Your card:", c.width - 150, 40);

    drawCard(c.width - 150, 50, true);
}

function drawCard(x, y, buying)
{
    var bgCardColor = "#FFFFFF";
    var cardTextColor = "#000000";
    var cardFont = "72px Cabin";
    var cardFont2 = "24px Cabin";

    ctx.fillStyle = bgCardColor;
    ctx.rect(x, y, 128, 160);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    ctx.fill();
    ctx.shadowColor = "transparent";

    ctx.fillStyle = cardTextColor;

    
    ctx.font = cardFont2;

    if (buying)
        ctx.fillText("Buying", x  + 128 / 2 - 20, y + 160 / 4);
    else
        ctx.fillText("Selling", x  + 128 / 2 - 20, y + 160 / 4);
    ctx.font = cardFont;
    ctx.fillText("7", x  + 128 / 2 - 20, y + 160 / 2 + 30);
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
    var labelFont = "12px Sans-serif"

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
    ctx.clearRect(0, 0, c.width, c.height);
}