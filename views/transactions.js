// Constants
var _BUFFER = 15;
var _WIDTH = 500;
var _HEIGHT = 500;
// Variables
var lst_transactions = [];

class Transaction
{
	constructor(transaction_id, val, time)
	{
		this.transaction_id = transaction_id;
		this.val = val;
		this.time = time;
		this.drawn = false;
	}
	// Getters
	transaction_id() { return this.transaction_id; }
	val() { return this.val; }
	time() { return this.time; }

	// Methods
	drawHTML()
	{
	if(this.drawn) { /*Don't draw it again */ return 1; }
	/* OFFER FORMAT
      <div class='offer-shape buyer'>
        <div class='offer-internal' style='float: left;'>
          $ XX\
        </div>
        <div class='offer-internal' style='float: right;'>
          <button>Accept</button>
        </div>
      </div>
	 */


	// Get initial content
	var old = document.getElementById("trade-list").innerHTML;


	// Create HTML element
	/*

      <div class='offer-shape trade'>
        <div class='offer-internal' style='float: left;'>
          $ XX\
        </div>
        <div class='offer-internal' style='float: right;'>
          <button>Accept</button>
        </div>
      </div>

	*/

	var html = "<div class='offer-shape trade'><div class='offer-internal' style='float: left;'>";
	html+= String(this.val);
	html+= "</div><div class='offer-internal' style='float: right;'>";
	html+= String(this.time);
	html+="</div></div>";

	// Draw to screen
	document.getElementById("trade-list").innerHTML = html + old;

	// Set as drawn
	this.drawn = true;
	return 0;
	}
}

function drawTransactionsList()
{
	for(var i = 0; i < lst_transactions.length; i++)
	{
		lst_transactions[i].drawHTML();
	}
}


/* Use these functions to connect to web sockets */
function recieveNewTrade(transaction_id, val, time)
{
	lst_transactions.push(new Transaction(transaction_id, val, time))
}