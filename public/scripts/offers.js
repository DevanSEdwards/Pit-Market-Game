function Offer(offerId, isSeller, price, time) {
	this.offerId = offerId;
	this.isSeller = isSeller;
	this.price = price;
	this.time = time;
}

function drawOfferList() {
	// TODO: Don't redraw every element everytime
	document.getElementById("offer-list").innerHTML = state.offers
		//.sort((a, b) => a.time - b.time) // Not needed because of unshift in receiveNewOffer()
		.map(({ offerId, isSeller, price }) => `
			<div id="${offerId}" class="offer-shape ${isSeller ? `seller` : `buyer`}"
				${
					!state.isHost &&
					(state.isSeller != isSeller) &&
					(state.isSeller ? price >= state.card + state.tax : price <= state.card) ?
					`onclick="acceptOffer('${offerId}')"` : ``
				}>
				${isSeller ? `Selling` : `Buying`} at ${price}
			</div>`)
		.join(``);
}

function clearOfferList() {
	// Called after EndRound
	for (let i = 0; i < state.offers.length; i++)
            state.offers.splice(i, 1);
}

function recieveNewOffer(offerId, isSeller, price, time) {
	// Called in main.js when a message of type 'offer' is received
	state.offers.unshift(new Offer(offerId, isSeller, price, time));
	drawOfferList();
}

function acceptOffer(offerId) {
	// Send acceptance message to server
	send({
		type: `accept`,
		offerId: offerId
	});
}

function submitOffer() {
	if (state.tradePrice === null)
	{ if (confirm("Please confirm trade!"))
		{
		let input = document.getElementById(`btnPostOffer`);
		offerprice = parseInt(input.value);
		// Submit offer to web server
		send({
			type: `offer`,
			price: parseInt(document.getElementById(`offerInput`).value)
		});
		input.disabled = true;
		input.style.backgroundColor = 'rgb(210, 210, 210)';
		window.setTimeout(() => {
			input.disabled = false;
			input.style.backgroundColor = 'turquoise';
		}, state.offerTimeLimit * 1000);
	} else {} }
}

function setRound(round) {
	let elements = document.getElementsByClassName("info_round");
	for (let i = 0; i < elements.length; i++)
		elements[i].innerHTML = `<span>Round: </span>${round}`;
}