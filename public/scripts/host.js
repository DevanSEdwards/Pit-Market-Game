import State from './state';

function loadpage(page)
{
    pages = document.getElementById(`root`).children;
    pages.hidden = true;
    document.getElementById(`${page}Page`).hidden = false;
}

function getCookie(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) 
    {
        var c = ca[i];
        while (c.charAt(0) == ' ') 
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) 
        {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function send_cookie_data(ws)
{
    ws.send(JSON.stringify({
        "type": "id",
        "gameId": getCookie(gameId),
        "isHost": getCookie(isHost),
        "clientId": getCookie(clientId)
    }));
}

function main() {
    var ws = new WebSocket(`wss://${window.location.host}/ws`);
    send_cookie_data(ws);
    loadpage(`deckSettings`);
}

document.onload = main;