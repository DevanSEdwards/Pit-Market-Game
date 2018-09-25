// Constants
var _BUFFER = 15;
var _WIDTH = 500;
var _HEIGHT = 500;
// Variables
var lst_offers = [];

var _BUYER = false;

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
	var html = "<div class='offer-shape ";
	if(this.buyer) { html += "buyer"; } else { html += "seller"; }
	html+="'><div class='offer-internal' style='float: left;'>$ ";
	html+=String(this.val);
	html+="</div><div class='offer-internal' style='float: right;'>";
	html+="<button onclick='acceptOffer(";
	html+=String(this.offer_id);
	html+=")'' ";
	if(_BUYER == this.buyer){ html += "disabled"; }
	html+=">Accept</button></div></div>";

	// Draw to screen
	document.getElementById("offer-list").innerHTML = html + old;

	// Set as drawn
	this.drawn = true;
	return 0;
	}
}

function test_draw(offerBuyer, playerBuyer)
{	/* Testing file for drawing offers */
	var html = "<div class='offer-shape ";
	if(offerBuyer) { html += "buyer"; }
	else { html += "seller"; }
	html+="'><div class='offer-internal' style='float: left;'>$ ";
	//html+=string(this.value);
	html+=String(25);
	html+="</div><div class='offer-internal' style='float: right;'>";
	html+="<button ";
	if(playerBuyer == false){ html += "disabled"; }
	html+=">Accept</button></div></div>";

	document.getElementById("offer-list").innerHTML+=html;
	return 0;
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
	lst_offers.push(new Offer(offer_id, buyer, val, time))
}

function acceptOffer(offerID)
{
	console.log("Accepting Offer...");
	console.log(String(offerID));
}