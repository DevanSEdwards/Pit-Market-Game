function Offer(offerId, isSeller, price, time) {
	this.offerId = offerId;
	this.isSeller = isSeller;
	this.price = price;
	this.time = time;
}

function drawOfferList() {
	// TODO: Don't redraw every element everytime
	document.getElementById("offer-list").innerHTML = state.offers
		.map(offer => `
			<div class='offer-shape ${offer.isSeller ? `seller` : `buyer`}'>
				<div class='offer-internal' style='float: left;'>$ ${String(offer.price)}</div>
				<div class='offer-internal' style='float: right;'>
					<button onclick='acceptOffer('${String(offer.offerId)}')'
						${state.isSeller === offer.isSeller ? `hidden` : ``}>Accept</button>
				</div>
			</div>`)
		.join(``);
}

function recieveNewOffer(offerId, isSeller, price, time) {
	// Called in main.js when a message of type 'offer' is received
	// isSeller is whether the offer is to sell or not
	state.offers.push(new Offer(offerId, isSeller, price, time));
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
	offerprice = parseInt(document.getElementById(`offerInput`).value);
	// Submit offer to web server
	send({
		type: `offer`,
		price: offerprice
	});
}

// Methods
// drawHTML() {
// 	if (this.drawn) { return; } // Don't draw it again

// 	// Get initial content
// 	var old = document.getElementById("offer-list").innerHTML;

// 	// Create HTML element
// 	var html = `
// 	<div class='offer-shape ${this.isSeller ? "seller" : "buyer"}'>
// 		<div class='offer-internal' style='float: left;'>$ ${String(this.price)}</div>
// 		<div class='offer-internal' style='float: right;'>
// 			<button onclick='acceptOffer(${String(this.offerId)})'
// 				${state.isSeller == this.isSeller ? 'hidden' : ''}>Accept</button>
// 		</div>
// 	</div>`;

// 	// Draw to screen
// 	document.getElementById("offer-list").innerHTML = html + old;

// 	// Set as drawn
// 	this.drawn = true;
// }