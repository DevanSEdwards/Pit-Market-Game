// Constants
var _BUFFER = 15;
var _WIDTH = 500;
var _HEIGHT = 500;
// Variables
var lst_offers = [];

var _BUYER = false;

class Offer
{
	constructor(id, buyer, time, value)
	{
		this.id = id;
		this.buyer = buyer;
		this.time = time;
		this.value = value;
	}
	get id() { return this.id; }
	get time() { return this.time; }
	get value() { return this.value; }
	isBuyer() { return this.buyer; }
	isSeller() { return !this.buyer; }

	drawHTML()
	{
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
		var html = "<div class='offer-shape ";
		if(isBuyer()) { html += "buyer"; }
		html+="'><div class='offer-internal' style='float: left;'>$ ";
		//html+=string(this.value);
	html+=string(25);
		html+="</div><div class='offer-internal' style='float: right;'>";
		html+="<button ";
		if(_BUYER == isBuyer()){ html += "disabled"; }
		html+=">Accept</button></div></div>";
	}
}

function draw()
{
	var html = "<div class='offer-shape ";
	if(false) { html += "buyer"; }
	else { html += "seller"; }
	html+="'><div class='offer-internal' style='float: left;'>$ ";
	//html+=string(this.value);
	html+=String(25);
	html+="</div><div class='offer-internal' style='float: right;'>";
	html+="<button ";
	if(_BUYER == true){ html += "disabled"; }
	html+=">Accept</button></div></div>";

	document.getElementById("offer-list").innerHTML=html;
}

function recieveNewOffer(offer)
{
	lst_offers.push(offer);
	reDrawOffers();
}

function reDrawOffers()
{
	console.log("Redraw");
}