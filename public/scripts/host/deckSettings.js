function drawDeckChart(mean, domain, lowerLimit, size=500) {
    var yTrans = Math.max(-lowerLimit, lowerLimit + domain - 2 * mean - 1);
    var yScale = size / (2 * Math.max(mean - lowerLimit, domain + lowerLimit - mean - 1));
    var xScale = size / domain; 

    var point;
    var n = 0;

    var svg = document.getElementById(`deckChart`);
    var sellChartLine = document.getElementById(`sellChartLine`);
    var buyChartLine = document.getElementById(`buyChartLine`);

    // Remove all points
    for (let i = sellChartLine.points.numberOfItems - 1; i >= 0; i--)
        sellChartLine.points.removeItem(i);
    for (let i = buyChartLine.points.numberOfItems - 1; i >= 0; i--)
        buyChartLine.points.removeItem(i);

    // Add new points
    for (let i = lowerLimit; i < lowerLimit + domain; i++) {
        point = svg.createSVGPoint();
        point.x = xScale * n++;
        point.y = yScale * (i + yTrans);
        sellChartLine.points.appendItem(point);
        point = svg.createSVGPoint();
        point.x = xScale * n;
        point.y = yScale * (i + yTrans);
        sellChartLine.points.appendItem(point);
    }
    for (let i = 2 * mean - lowerLimit - domain + 1; i < 2 * mean - lowerLimit + 1; i++) {
        point = svg.createSVGPoint();
        point.x = xScale * n--;
        point.y = yScale * (i + yTrans);
        buyChartLine.points.appendItem(point);
        point = svg.createSVGPoint();
        point.x = xScale * n;
        point.y = yScale * (i + yTrans);
        buyChartLine.points.appendItem(point);
    }
}

function redrawDeck() {
    drawDeckChart(
        parseInt(document.getElementById(`domainInput`).value),
        parseInt(document.getElementById(`meanInput`).value),
        parseInt(document.getElementById(`lowerLimitInput`).value)
    )
}