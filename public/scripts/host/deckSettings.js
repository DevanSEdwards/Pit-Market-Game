function initDeckSettings() {
    document.getElementById(`meanInput`).value = state.deckSetting.mean;
    document.getElementById(`domainInput`).value = state.deckSetting.domain;
    document.getElementById(`lowerLimitInput`).value = state.deckSetting.lowerLimit;
    redrawDeck();
}

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
        parseInt(document.getElementById(`meanInput`).value),
        parseInt(document.getElementById(`domainInput`).value),
        parseInt(document.getElementById(`lowerLimitInput`).value)
    )
}

function submitDeck() {
    state.websocket.send(JSON.stringify({
        type: `deckSettings`,
        mean: parseInt(document.getElementById(`meanInput`).value),
        domain: parseInt(document.getElementById(`domainInput`).value),
        lowerLimit: parseInt(document.getElementById(`lowerLimitInput`).value)
    }));
    loadpage(`roundSettings`);
}