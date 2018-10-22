function setTrading(canTrade) {
    document.getElementById(`btnPostOffer`).disabled = !canTrade;
    if(canTrade)
    {
    	document.getElementById(`btnPostOffer`).value = `Post Offer`;
    } else {
    	document.getElementById(`btnPostOffer`).value = `Traded at $${state.tradePrice}`;
    	if(state.tradePrice != null) { alert(`Trade accepted at $${state.tradePrice}`); }

    }
}

function setCard(value, isSeller) {
    document.getElementById(`cardValue`).innerText = '$' + String(value);
    document.getElementById(`cardIsSeller`).innerText = isSeller === null ? `Spectating` : isSeller ? `Selling` : `Buying`;
}