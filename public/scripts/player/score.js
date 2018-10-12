function calculateScore()
{
	var rounds = state.rounds;
	var profit = 0;
<<<<<<< Updated upstream
	for(var i = 0; i < rounds.length; i++)
=======
	for(let i = 0; i < rounds.length; i++)
>>>>>>> Stashed changes
	{
		var price = round[i].tradePrice;
		if(price = null) { continue; }
		else { profit += price; }
	}
}

function displayScore() { document.getElementById("info_score").innerHTML = '$' + String(calculateScore()); }

function setScoreDISPLAY(score) { document.getElementById("info_score").innerHTML = '$' + String(score); }