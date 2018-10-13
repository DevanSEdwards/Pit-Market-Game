function setTrading(canTrade) {
    document.getElementById(`btnPostOffer`).disabled = !canTrade;
    document.getElementById(`btnPostOffer`).value = canTrade ? `Post Offer` : `Traded at: ${state.tradePrice}`;
}

function setCard(value, isSeller) {
    document.getElementById(`cardValue`).innerText = value;
    document.getElementById(`cardIsSeller`).innerText = isSeller ? `Seller` : `Buyer`;
}