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
		this.buyer = buyer;
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

	// Create HTML element
	var html = "<div class='offer-shape ";
	if(this.isBuyer) { html += "buyer"; } else { html += "seller"; }
	html+="'><div class='offer-internal' style='float: left;'>$ ";
	html+=String(this.val);
	html+="</div><div class='offer-internal' style='float: right;'>";
	html+="<button ";
	if(playerBuyer == false){ html += "disabled"; }
	html+=">Accept</button></div></div>";

	// Draw to screen
	document.getElementById("offer-list").innerHTML+=html;

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

function recieveNewOffer(offer_id, buyer, val, time)
{
	lst_offers.push(new Offer(offer_id, buyer, val, time))
}

function drawOfferList()
{
	for(var i = 0; i < lst_offers.length; i++)
	{
		lst_offers[i].drawHTML();
	}
}