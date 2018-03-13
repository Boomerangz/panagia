const someUserAgents = [
    'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>',
    'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
    'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'
];
function getRandomBrowserUA() {    
    return someUserAgents[Math.floor(Math.random()*someUserAgents.length)];
}

exports.getRandomBrowserUA = getRandomBrowserUA;