function calculateScore()
{
	// var rounds = state.rounds;
	// var profit = 0;
	// var cardValue = state.card;
	// var tax = state.tax;

	// for(var i = 0; i < rounds.length; i++)
	// {
	// 	var price = rounds[i].tradePrice;

	// 	if(price == null) { continue; }
	// 	else { 
	// 		if(state.isSeller == true){
	// 			tempProfit = price - cardValue - tax;
	// 			profit += tempProfit;
	// 		} else { 
	// 			tempProfit = cardValue - price;
	// 			profit += tempProfit;
	// 		}
			
	// 	}
	// }
	return state.profit;
}

function displayScore() { 
	var elems = document.getElementsByClassName("info_profit"); 
	for (var i = 0; i < elems.length; i++)
		elems[i].innerHTML = '$' + String(calculateScore()); 
}

/* DEBUG FUNCTIONS */
function setScoreDISPLAY(score) { document.getElementById("info_profit").innerHTML = '$' + String(score); }
