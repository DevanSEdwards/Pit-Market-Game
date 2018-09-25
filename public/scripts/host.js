function loadpage(page)
{
    pages = document.getElementById('root').children;
    pages.hidden = true;
    document.getElementById(page + "Page").hidden = false;
}

loadpage("round");