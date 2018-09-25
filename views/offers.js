var canvas = document.getElementById("canvasDisplay");
var ctx = canvas.getContext("2d");

// Constants
var _BUFFER = 15;
var _WIDTH = 500;
var _HEIGHT = 500;
// Variables
var lst_offers = [];

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