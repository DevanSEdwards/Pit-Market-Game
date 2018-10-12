function Transaction(transactionID, value, time)
{
	this.transactionID = transactionID;
	this.price = value;
	this.time = time;
}

function drawTransactionList()
{
	// TODO: Don't redraw every element everytime
	document.getElementById("offer-list").innerHTML = state.offers
		.map(offer => `
			<div class='offer-shape trade'>
				<div class="offer-internal" style="float: left">
				$ ${String(transaction.price)}
				</div>
				<div class="offer-internal" style="float: right">
				$ ${String(transaction.time)}
				</div>
			</div>
			`).join(``);
}

function recieveNewTransaction(transactionID, price, time) {
	// Called in main.js when a message of type 'transaction' is received
	// isSeller is whether the offer is to sell or not
	state.offers.push(new Transaction(transactionID, price, time));
	drawTransactionList();
}

