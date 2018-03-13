const urlJoin = require("url-join");
const getHostname = require('./hostname').getHostname

function normalizeLink(parentLink, link) {
    if (link.slice(0,2) == '//') {
        link = 'https:' + link;
    }
    if (!getHostname(link)) {
        link = urlJoin(parentLink, link);
    }
    return link;
}

exports.normalizeLink = normalizeLink;