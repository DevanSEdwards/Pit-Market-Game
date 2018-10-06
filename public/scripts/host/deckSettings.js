function initDeckSettings() {
    document.getElementById(`meanInput`).value = state.deckSetting.mean;
    document.getElementById(`domainInput`).value = state.deckSetting.domain;
    document.getElementById(`lowerLimitInput`).value = state.deckSetting.lowerLimit;
    redrawDeck();
}

function drawDeckChart(mean, domain, lowerLimit, size=500) {
    let sellStart = lowerLimit,
        sellEnd = lowerLimit + domain,
        buyStart = 2 * mean - lowerLimit - domain + 1,
        buyEnd = 2 * mean - lowerLimit + 1;
    
    var yTrans = -Math.min(sellStart, buyStart);
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
    for (let i = sellStart; i < sellEnd; i++) {
        point = svg.createSVGPoint();
        point.x = xScale * n++;
        point.y = size - (yScale * (i + yTrans));
        sellChartLine.points.appendItem(point);
        point = svg.createSVGPoint();
        point.x = xScale * n;
        point.y = size - (yScale * (i + yTrans));
        sellChartLine.points.appendItem(point);
    }
    for (let i = buyStart; i < buyEnd; i++) {
        point = svg.createSVGPoint();
        point.x = xScale * n--;
        point.y = size - (yScale * (i + yTrans));
        buyChartLine.points.appendItem(point);
        point = svg.createSVGPoint();
        point.x = xScale * n;
        point.y = size - (yScale * (i + yTrans));
        buyChartLine.points.appendItem(point);
    }

    function setLabelAttributes(label, x, y, textContent, textAnchor, hidden) {
        label.setAttribute(`x`, x);
        label.setAttribute(`y`, size - (yScale * (y + yTrans)));
        label.textContent = textContent;
        label.setAttribute(`text-anchor`, textAnchor);
        label.style.display = hidden ? `none` : `block`;
    }

    setLabelAttributes(
        svg.getElementById(`meanLabel`),
        -size / 20,
        mean,
        mean,
        `end`,
        false
    );
    setLabelAttributes(
        svg.getElementById(`sellStartLabel`),
        -size / 20,
        sellStart,
        sellStart,
        `end`,
        (domain / Math.abs(mean - sellStart)) > 10
    );
    setLabelAttributes(
        svg.getElementById(`buyEndLabel`),
        -size / 20,
        buyEnd - 1,
        buyEnd - 1,
        `end`,
        (domain / Math.abs(mean - buyEnd + 1)) > 10
    );
    setLabelAttributes(
        svg.getElementById(`buyStartLabel`),
        size + size / 20,
        buyStart,
        buyStart,
        `start`,
        (domain / Math.abs(mean - buyStart)) > 10
    );
    setLabelAttributes(
        svg.getElementById(`sellEndLabel`),
        size + size / 20,
        sellEnd - 1,
        sellEnd - 1,
        `start`,
        (domain / Math.abs(mean - sellEnd + 1)) > 10
    );
    console.log(meanLabel);
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
        type: `card settings`,
        mean: parseInt(document.getElementById(`meanInput`).value),
        domain: parseInt(document.getElementById(`domainInput`).value),
        lowerLimit: parseInt(document.getElementById(`lowerLimitInput`).value)
    }));
    loadpage(`roundSettings`);
}