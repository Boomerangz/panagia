const request = require('request-promise-native');
const getHostname = require('../utils/hostname').getHostname
const parseString = require('xml2js').parseString;

async function getAlexaInfo(url) {
    const hostname = getHostname(url);
    const response = await request.get(`http://data.alexa.com/data?cli=10&url=${hostname}`)
    const parsedResponse = await parseXml(response);    
    return {
        rank: parsedResponse.ALEXA.SD[0].REACH[0].$.RANK
    };
}

function parseXml(xmlString) {
    return new Promise((resolve, reject) => {
        parseString(xmlString, 
            (err, result) => resolve(result)
        );
    });    
}

exports.getAlexaInfo = getAlexaInfo;