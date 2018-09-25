function loadpage(page)
{
    var inner = '<object type="text/html" data="./host/' + page + '.html"></object>';
    document.getElementById('root').innerHTML=inner;
}

loadpage("round");