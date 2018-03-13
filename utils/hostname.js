const urlParser = require("url");

function getHostname(url) {
    const parsed = urlParser.parse(url);
    return parsed.hostname;
}

function isSameHostName(url1, url2) {
    const result1 = urlParser.parse(url1);
    const result2 = urlParser.parse(url2);
    return !(result1.hostname && result2.hostname) || result1.hostname == result2.hostname
}

exports.getHostname = getHostname;
exports.isSameHostName = isSameHostName;