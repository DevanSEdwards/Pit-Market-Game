function drawTransactionList()
{
	// TODO: Don't redraw every element everytime
	document.getElementById("trade-list").innerHTML = (state.trades == null ? [] : state.trades)
		.map(price => `
			<div class='offer-shape trade'>
				<div class="offer-internal" style="float: left">
				$ ${price}
				</div>
			</div>`)
		.join(``);
}

