function Offer(offerId, isSeller, price, time) {
	this.offerId = offerId;
	this.isSeller = isSeller;
	this.price = price;
	this.time = time;
}

function drawOfferList() {
	var st = offer.isSeller;
	var id = offer.offerId;

	// Rearranged; should fix the bug but I can't join a game to test it x.x
	var html = "";
	html += "<div id='" + String(id) + "' class='offer-shape "
	if(st) { html += "seller"; } else { html += "buyer"; }
	html += `' onclick="acceptOffer('${offer.offerId}')"><div class='offer-internal' style='float: left;'>`;
	if(st) { html += "Selling at"; } else { html += "Buying at"; }
	html += String(offer.price) + "</div><div class='offer-internal' style='float: right;'>"
	html += `${
				!state.isHost &&
				(state.isSeller != offer.isSeller) &&
				(state.isSeller ? offer.price >= state.card + state.tax : offer.price <= state.card) ? 
				`<button onclick="acceptOffer('${offer.offerId}')">Accept</button>` : ``
			}`;
	html += "</div></div>"
	// TODO: Don't redraw every element everytime
	document.getElementById("offer-list").innerHTML = state.offers
		.map(offer => html).join('');
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

function setRound(round) {
	let elements = document.getElementsByClassName("info_round");
	for (let i = 0; i < elements.length; i++)
		elements[i].innerHTML = `<span>Round: </span>${round}`;
}