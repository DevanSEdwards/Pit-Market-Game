/* Script for drawing help text division */
function drawHelp(id)
{
	document.getElementById(id).classList.remove("hidden");
	document.getElementById(id).innerHTML = helphtml(id);
}
function hideHelp(id)
{
	document.getElementById(id).classList.add("hidden");
	document.getElementById(id).innerHTML = "";
}



/* Helper functions to clean up HTML pages and 
 *	keep duplicate code together 
 */

function helphtml(id)
{
	var data = helpText(id);
	var html = "";

	html += "<h4>" + data[0] + "</h4>";
	html += "<p>"  + data[1] + "</p>";

	return html;
}
function helpText(id)
{
	var head = "";
	var p = "";

	switch (id)
	{
		case '':
			//
			break;
		case "help_cardBuyer":
			head = "Your player card";
			p = "This is your card. You are currently a buyer; you can pay up to the large number displayed.";
			break;
		case "help_cardSeller":
			head = "Your player card";
			p = "This is your card. You are currently a seller; the large number is the lowest you can sell your card for.";
			break;	
		case "help_postOffer":
			head = "Post an offer here!";
			p = "Your offer will appear in the offers list below for other people to accept. If accepted; you will earn the difference between your card and your offer.";
			break;
		default:
			head = "Invalid Help ID";
			p = "This help text either has not been implemented or has been incorrectly implemented. Please inform the game host of this issue and they will explain answer your question";
			console.log("Attempted to draw help text with incorrect ID");
			break;
	}

	return [head, p];
}