function setTrading(canTrade) {
    document.getElementById(`btnPostOffer`).disabled = !canTrade;
    document.getElementById(`btnPostOffer`).value = canTrade ? `Post Offer` : `Traded at $${state.tradePrice}`;
}

function setCard(value, isSeller) {
    document.getElementById(`cardValue`).innerText = '$' + String(value);
    document.getElementById(`cardIsSeller`).innerText = isSeller === null ? `Spectating` : isSeller ? `Selling` : `Buying`;

    let input = document.getElementById(`btnPostOffer`);
	input.disabled = false;
	input.style.backgroundColor = 'turquoise';
}