/*
 * HOW TO USE THIS FILE
 *
 * Insert
 <div class="helpBubble" onmouseover="drawHelp(help_id);" onmouseout="hideHelp();" unselectable="on">?</div>
 * into a relative division of on the page
 * change the help_id to the appropriate id
 *
 ** LIST OF IDs
 * 
 */	



/* Script for drawing help text division */
function drawHelp(id)
{
	document.getElementById("help_displayText").classList.remove("hidden");
	document.getElementById("help_displayText").innerHTML = helphtml(id);
	return;
}
function hideHelp()
{
	document.getElementById("help_displayText").classList.add("hidden");
	document.getElementById("help_displayText").innerHTML = "";
	return;
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
	var head = '';
	var p = '';
	/* Lilo and Switch help the user */
	switch(id) {
		case 'help_warning':
			head = "Why?";
			p = "You might not want your students to know the settings you use to make the game.<br /> We advise you keep the next screen hidden while you set everything up."
			break;
		case 'help_setupMean':
			head='Mean Distribution of Cards';
			p=""
			break;
		case 'help_setupDomain':
			head = 'Range of each deck';
			p="The number of unique card values in each deck";
			break;
		case 'help_setupLowerLimit':
			head='Lower card limit';
			p="";
			break;
		case 'help_setupDeckGraph':
			head='Decks visualization';
			p="This represents the two decks and the values they will take. The orange 'staircase' represents the buyer deck, and the blue the seller deck. Each 'step' represents a value that those cards may take. The decks meet at the mean value."
			break;
		case 'help_setupShape':
			head = 'Shape of the graph';
			p="The ratio of seller cards above the mean, and of buyer cards below the mean. The higher the value, the more trades will take place.";
			break;
		case 'help_cardBuyer':
			head = 'Your player card';
			p = 'This is your card. You are currently a buyer; you can pay up to the large number displayed.';
			break;
		case 'help_cardSeller':
			head = 'Your player card';
			p = 'This is your card. You are currently a seller; the large number is the lowest you can sell your card for.';
			break;
		case 'help_cardMisc':
			head = "Your player card";
			p = "This is your card. It will indicate if you are selling or buying, as well as the limit to your transactions."
			break;
		case 'help_postOffer':
			head = 'Post an offer here!';
			p = 'Your offer will appear in the offers list below for other people to accept. If accepted; you will earn the difference between your card and your offer.';
			break;
		case 'help_offerList':
			head = 'List of available offers';
			p = 'This is a list of offers that are currently available for you to accept. Offers for buyers will appear on the right, whereas offers for sellers will appear on the left. You only see the offer, not the value of the card. You will earn the difference between your car and the accepted offer.';
			break;
		case 'help_transactionList':
			head = 'List of past transactions';
			p = 'This is a list of transactions that have successfully been made during the course of the game. You cannot see which pair made the trade nor how much they earned.';
			break;
		case 'help_playerCount':
			head = 'Plaayer Counter';
			p = 'This is the number of players total in the game. You are one of the people listed';
			break;
		case 'help_timer':
			head = 'Round Timer';
			p = 'This is how much time is left. <em>Quick!</em> The round is ticking to an end!';
			break;
		case 'help_joinGame':
			head = 'Join Game';
			p = 'Enter your room code here then press join. Do not have a room code? Ask your lecturer or tutor for the code to join the game.<br/ >Are you trying to host a game? Please refer to the external documentation.';
			break;
		case 'help_settingsTax':
			head = 'Tax settngs';
			p = 'Set the tax for the next round of play. Tax will <em>not</em> be reset between rounds.';
			break;
		case 'help_settingsTime':
			head = "Round length";
			p = "Set how long the next round of play will go for. You can always end the round manually if it is going too long";
			break;
		case 'help_settingsFloor':
			head = 'Price floor and ceiling settings';
			p = 'Set a price cap or floor for all trades in the next round. This setting will <em>not</em> be reset between rounds.';
			break;
		case 'help_settingsQR':
			head = "QR Code";
			p = "Get your students to scan this with their phone barcode reader. Students with Snapchat can use that!";
			break;
		case 'help_settingsCode':
			head = "Game code";
			p = "This is the game code! Get your students to go to the URL and type in this game code. Upper and lower case do not matter.";
			break;
		case 'help_settingsTimeout':
			head = "Time per trade";
			p = "This is the amount of time a trade will be active after a player makes it. During this time, the player cannot make a new trade offer."
			break;
		case 'help_settingsEmail':
			head = "Email Game Data";
			p = "Enter an email to send the game data to your inbox.";
			break;
		case 'help_profit':
			head = 'Profit';
			p = 'This is how much you have earned this game so far. Congratulations of your gains.';
			break;
		default:
			head = 'Invalid Help ID';
			p = 'This help text either has not been implemented or has been incorrectly implemented. Please inform the game host of this issue and they will explain answer your question';
			console.log('Attempted to draw help text with incorrect ID');
			break;
	}
	/* END OF SWITCH */
	return [head, p];
}