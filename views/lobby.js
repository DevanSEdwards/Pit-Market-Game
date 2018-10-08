var help;

function getContext(id) { return document.getElementById(id); }

function defaultText()
{
	div = getContext("help_text");
	var html = "<h1>First Time?</h1><p>Use the buttons below to learn more about the game</p>";
	div.innerHTML = html;
}
function about()
{
	// Get Context
	div = div = getContext("help_text");

	// Crete html
	var html = "<h1>About the Pit Market Game</h1>"
	html += "<p>The pit market game is a tool used to demonstraight how the free market will eventually come to settle on a fair price for goods and services.</p>"
	html += "<p>The pit market game is traditionally played in a classroom where the players are free to move around<p>"
	html += "<p>TODO</p>";

	// Set the html
	div.innerHTML = html;
}
function rules()
{
	// Get Context
	div = div = getContext("help_text");

	// Crete html
	var html = "<h1>Rules of the Pit Marget Games</h1>"
	
	html += "<p>Every player will be assigned a card at random. This card will tell you wether you are buying or selling, and what your card is worth.</p>"
	html += "<p><b>Buyers</b> can not buy a card for more than their card's calue<br/>";
	html += "<b>Sellers</b> can not sell a card for less than their card's value</p>";

	html += "<p>Every round, you can make an offer for someone else to accept or accept someone elses offer. You <emp>do not</emp> know the value of the card you are trading for though. You will have to try and make an offer that is good for you without knowing what other cards are availiable. "

	html += "<p>This is all the simple rules, but the host can introduce more advanced rules at any stage in the game. Check out the special rules using the button below."
	// Set the html
	div.innerHTML = html;
}
function how()
{
	// Get Context
	div = div = getContext("help_text");

	// Crete html
	var html = "<h1>How to play the game</h1>"
	html += "TODO"
	// Set the html
	div.innerHTML = html;
}

function special()
{
	// Get Context
	div = div = getContext("help_text");

	// Crete html
	var html = "<h1>Special Rules</h1>"
	html += "<p> The host of the game can introduced some special rules for each round or the whole game. Any special rules will be displayed on the screen during the round and on the lobby screen.<p>"
	
	// Tax
	html += "<h2>Tax</h2>";
	html += "<p><b>Tax</b> will be a flat cost that the <emp>seller</emp> must pay when they successfully sell a card."
	html += " For example;</p><p>" + "If a card of value <u>$10</u> is sold for a value of <u>$15</u> and there is currently a <u>$2</u> in place, the seller will get the <u>$5</u> of Initial profit, then pay the tax to have a net gain of <u>$3</u> for the round</p>";
	html += "<p>Sale Value - Card Value - Tax = Profit<br />"
	html += "$15 - $10 - $2 = $3<p>"
	html += "<p>Tax is a real-world phenomenon that governments impose on the sale of goods and services in everyday life and this rule will demonstrait how tax may affect the free market."
	// Price ceiling/floor
	html += "<h2>Price ceiling/floor</h2>";
	html += "<p>When there is either a price ceiling or floor in place, there is a limit to how much a card can be brought or sold at. A price floor sets a minimum value that a card can be sold at and a price cielding reflects the maximum value. During any particular round, there will only be <emp>one</emp> of either option and never both.<p>"
	html += "<p>The <b>floor</b> may reprent a minimum cost of production of the goods or services for a company"
	html += "<br />The <b>ceiling</b> may reprent ???</p>"
	html += "<p>Note that <b>it is possible</b> that you will no longer be able to make a trade when this rule is in place. In the real world, compainies could be forced out of a market because of various policies or costs introduced.<p>"

	// Set the html
	div.innerHTML = html;	
}