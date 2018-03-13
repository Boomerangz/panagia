#!/usr/local/bin/node

const startup = require('./start/start_up');
const options = startup.startUp();
if (!options) {
    return
}

const chalk = require('chalk');
const request = require('request-promise-native');
const jssoup = require('jssoup').default;
const urlParser = require("url");


function isSameHostName(url1, url2) {
    const result1 = urlParser.parse(url1);
    const result2 = urlParser.parse(url2);
    return !(result1.hostname && result2.hostname) || result1.hostname == result2.hostname
}

Array.prototype.unique = function unique() {
    return Array.from(new Set(this));
}

function processLinks(linksList, attributeName, parentHostname, sameHostname) {
    return linksList.map(elem => elem.attrs[attributeName]).filter(elem => elem && elem[0] != '#' && (isSameHostName(parentHostname, elem) == sameHostname)).unique().sort()
}


async function analyzeWebPage(url) {
    console.log(chalk`Analyze of {green.bold ${url}} started.`);
    let html;
    const before = new Date();
    try {        
        html = await request.get(url);                
    } catch (error) {
        if (error.message) {
            console.log(error.message);
        } else {
            console.log(error);
        }
        return
    }
    //checking loading time
    const timing = new Date() - before;
    const size = html.length;

    const webPage = new jssoup(html);
    const result = {
        timing: `${timing} ms`,
        size: `${size} bytes`,
        title: webPage.find('title').getText()        
    };
    
    //checking for external loading resources
    result.external = {}
    result.external.Scripts = processLinks(webPage.findAll('script'), 'src', url, false);
    result.external.Styles = processLinks(webPage.findAll('link', {rel:"stylesheet"}), 'href', url, false); 
    result.external.Images = processLinks(webPage.findAll('img'), 'src', url, false); 
    result.external.Links = processLinks(webPage.findAll('a'), 'href', url, false); 
    result.external.Iframes = processLinks(webPage.findAll('iframe'), 'src', url, false); 

    // //checking for internal loading resources
    result.internal = {}
    result.internal.Scripts = processLinks(webPage.findAll('script'), 'src', url, true);
    result.internal.Styles = processLinks(webPage.findAll('link', {rel:"stylesheet"}), 'href', url, true); 
    result.internal.Images = processLinks(webPage.findAll('img'), 'src', url, true); 
    result.internal.Links = processLinks(webPage.findAll('a'), 'href', url, true); 
    result.internal.Iframes = processLinks(webPage.findAll('iframe'), 'src', url, true); 
    
    console.log(result);
}

analyzeWebPage(options.url);

