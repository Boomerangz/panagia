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
const userAgents = require("./utils/useragents")

const resourcesAnalyze = require("./analyzers/external_resources_analyzer");
const alexaAnalyze = require("./analyzers/alexa_rank");
const blackListAnalyze = require("./analyzers/black_list_analyzer");
const httpsAnalyzer = require("./analyzers/https_analyzer");




//Setup the main analyzing
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
        iframes: false,
        requestOptions: options,
    };
    result.resources = await resourcesAnalyze.analyzeExternalResources(webPage, url, resourcesAnalyzeOptions);
    result.alexaInfo = await alexaAnalyze.getAlexaInfo(url);
    result.isInBlackList = await blackListAnalyze.isInBlackList(url);
    result.fullyHttps = httpsAnalyzer.isFullyHttps(result.resources);
    console.log(JSON.stringify(result, null, 2));
}



//check if we need to set User Agent

let ua;
if (options.browser) {
    ua = userAgents.getRandomBrowserUA();
}
const queryOptions = {    
    headers: {
        "user-agent": ua
    }
}

//And start the analyzing
analyzeWebPage(options.url, queryOptions);