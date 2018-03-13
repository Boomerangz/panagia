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
const urlJoin = require("url-join");
const resourcesAnalyze = require("./analyzers/external_resources_analyzer")

async function analyzeWebPage(url, options) {
    console.log(chalk`Analyze of {green.bold ${url}} started.`);
    let html;
    const before = new Date();
    try {        
        const queryOptions = Object.assign({}, options);
        queryOptions.url = url;
        html = await request.get(queryOptions);                
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
    };
    const titleTag = webPage.find('title');
    if (titleTag) {
        result.title= webPage.find('title').getText();
    }
    
    const resourcesAnalyzeOptions = {
        internal: true,
        external: true,
        scripts: true,
        links: true,
        images: true,
        styles: true,
        iframes: true,
        requestOptions: options,
    };
    result.resources = await resourcesAnalyze.analyzeExternalResources(webPage, url, resourcesAnalyzeOptions);
    console.log(JSON.stringify(result, null, 2));
}

let ua = '';
if (options.browser) {
    ua = getBrowserUA();
}
const queryOptions = {    
    headers: {
        "User-Agent": ua
    }
}

analyzeWebPage(options.url, queryOptions);


// ================ Helping functions ===============

function getHostname(url) {
    const parsed = urlParser.parse(url);
    return parsed.hostname;
}

function isSameHostName(url1, url2) {
    const result1 = urlParser.parse(url1);
    const result2 = urlParser.parse(url2);
    return !(result1.hostname && result2.hostname) || result1.hostname == result2.hostname
}





function getBrowserUA() {
    return `Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>`
}