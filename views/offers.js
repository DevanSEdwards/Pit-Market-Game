// Constants
var _BUFFER = 15;
var _WIDTH = 500;
var _HEIGHT = 500;
// Variables
var lst_offers = [];

var _BUYER = true;

class Offer
{
	constructor(offer_id, buyer, val, time)
	{
		this.offer_id = offer_id;
		if(buyer == 0) { this.buyer = false } else { this.buyer = true; }
		this.val = val;
		this.time = time;
		this.drawn = false;
	}
	// Getters
	offer_id() { return this.offer_id; }
	buyer() { return this.buyer; }
	//seller() { if(this.buyer){return false;} else {return true;} }
	val() { return this.val; }
	time() { return this.time; }

	// Methods
	drawHTML()
	{
	if(this.drawn) { /*Don't draw it again */ return 1; }
	/* OFFER FORMAT
      <div class='offer-shape buyer'>
        <div class='offer-internal' style='float: left;'>
          $ XX
        </div>
        <div class='offer-internal' style='float: right;'>
          <button>Accept</button>
        </div>
      </div>
	 */


	// Get initial content
	var old = document.getElementById("offer-list").innerHTML;


	// Create HTML element
	var html = `
		<div class='offer-shape ${this.buyer ? "buyer'": "seller'"}>
			<div class='offer-internal' style='float: left;'>$ ${String(this.val)}</div>
			<div class='offer-internal' style='float: right;'>
				<button onclick='acceptOffer(${String(this.offer_id)})' ${_BUYER == this.buyer ? 'disabled' : ''}>Accept</button>
			</div>
		</div>
		`;

	// Draw to screen
	document.getElementById("offer-list").innerHTML = html + old;

	// Set as drawn
	this.drawn = true;
	return 0;
	}
}

function drawOfferList()
{
	for(var i = 0; i < lst_offers.length; i++)
	{
		lst_offers[i].drawHTML();
	}
}


/* Use these functions to connect to web sockets */
function recieveNewOffer(offer_id, buyer, val, time)
{
	// Buyer is whether the offer is to buy or now
	lst_offers.push(new Offer(offer_id, buyer, val, time))
}

function acceptOffer(offerID)
{
	console.log("Accepting Offer...");
	console.log(String(offerID));
}


function submitOffer()
{
	// TODO: Check if element is blocked
	offerVal = document.getElementById("offerInput").value;
	// Submit offer to web server
	// TODO: Recieve offerID from server
	// If no errors; display new offer and block
	blockID("offerInput");
	recieveNewOffer('NULL', _BUYER, offerVal, Date.now());
	drawOfferList();
}