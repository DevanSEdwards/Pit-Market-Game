var _isOverlap = true;
var _size = 500;


function initDeckSettings() {
    document.getElementById(`meanInput`).value = state.deckSetting.mean;
    document.getElementById(`domainInput`).value = state.deckSetting.domain;
    document.getElementById(`lowerLimitInput`).value = state.deckSetting.lowerLimit;
    redrawDeck(false);
    redrawDeck(true);
}

function drawDeckChart(mean, domain, lowerLimit, size = _size) {
    let sellStart = lowerLimit,
        sellEnd = lowerLimit + domain,
        buyStart = 2 * mean - lowerLimit - domain + 1,
        buyEnd = 2 * mean - lowerLimit + 1;

    var yTrans = -Math.min(sellStart, buyStart);
    var yScale = size / (2 * Math.max(mean - lowerLimit, domain + lowerLimit - mean - 1));
    var xScale = size / domain;

    if (yScale === Infinity) {
        yScale = size / 2;
        yTrans = - mean + 1;
    }

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
        (domain / Math.abs(sellEnd - buyStart)) > 10
    );
    setLabelAttributes(
        svg.getElementById(`sellEndLabel`),
        size + size / 20,
        sellEnd - 1,
        sellEnd - 1,
        `start`,
        false
    );
}

function highlightOverlap() {
    overlapInput = document.getElementById(`overlapInput`);
    overlap = parseFloat(overlapInput.value);
    higlightOverlap = document.getElementById(`highlightOverlapLine`);
    higlightOverlap.setAttribute(`x1`, overlap * _size);
    higlightOverlap.setAttribute(`x2`, overlap * _size);
    _isOverlap = (_isOverlap || document.activeElement === overlapInput) && document.activeElement !== document.getElementById(`lowerLimitInput`);
    higlightOverlap.style.display = _isOverlap ? `block` : `none`;
    document.getElementById(`sellStartLabel`).style.fill = _isOverlap ? `black` : `rgba(255,0,0,0.5)`;
    overlapInput.style.color = _isOverlap ? `rgba(255,0,0,0.5)` : `black`;
    document.getElementById(`lowerLimitInput`).style.color = _isOverlap ? `black` : `rgba(255,0,0,0.5)`;
}

function redrawDeck(isOverlap) {
    let mean = parseInt(document.getElementById(`meanInput`).value);
    let domain = parseInt(document.getElementById(`domainInput`).value);
    let lowerLimit = parseInt(document.getElementById(`lowerLimitInput`).value);
    let overlap = parseFloat(document.getElementById(`overlapInput`).value);

    if (domain < 1) {
        document.getElementById(`domainInput`).value = 1;
        domain = 1;
    }        

    if (isOverlap !== null) {
        _isOverlap = isOverlap;
    }
    if (_isOverlap) {
        lowerLimit = Math.round(mean - overlap * domain + 0.5);
        document.getElementById(`lowerLimitInput`).value = lowerLimit;
    }
    else {
        overlap = Math.round(100 * (mean - lowerLimit + 0.5) / domain) / 100;
        document.getElementById(`overlapInput`).value = overlap;
    }

    drawDeckChart(mean, domain, lowerLimit);
    highlightOverlap();
}

function resetDeck() {
    state.deckSetting = { mean: 6, domain: 7, lowerLimit: 2 };
    initDeckSettings();
}

function submitDeck() {
    let mean = parseInt(document.getElementById(`meanInput`).value);
    let domain = parseInt(document.getElementById(`domainInput`).value);
    let lowerLimit = parseInt(document.getElementById(`lowerLimitInput`).value);

    state.deckSetting = { mean: mean, domain: domain, lowerLimit: lowerLimit };

    state.websocket.send(JSON.stringify({
        type: `card settings`,
        mean: mean,
        domain: domain,
        lowerLimit: lowerLimit
    }));
    loadpage(`roundSettings`);
}