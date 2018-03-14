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
const technologyAnalyzer = require("./analyzers/technology_analyzer");

const formatOutput = require("./utils/format_ouput")


//Setup the main analyzing
async function analyzeWebPage(url, formatJson, options) {
    console.log(chalk`Analyze of {green.bold ${url}} started.`);
    let response;
    const before = new Date();
    try {        
        const queryOptions = Object.assign({
            resolveWithFullResponse: true
        }, options);
        queryOptions.url = url;
        response = await request.get(queryOptions);                
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
    const size = response.body.length;

    const webPage = new jssoup(response.body);
    const result = {
        timing: `${timing} ms`,
        size: `${size} bytes`,
        url: url            
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
    console.log(chalk`Analyze of {yellow.bold external resources} started.`);
    result.resources = await resourcesAnalyze.analyzeExternalResources(webPage, url, resourcesAnalyzeOptions);
    result.isInBlackList = await blackListAnalyze.isInBlackList(url);
    result.fullyHttps = httpsAnalyzer.isFullyHttps(result.resources);
    //=============
    console.log(chalk`Analyze of {red.bold alexa data} started.`);
    try {
        result.alexaInfo = await alexaAnalyze.getAlexaInfo(url);
    } catch (e) {
        console.log(chalk`Analyze of {red.bold alexa data} failed.`);
    }
    //=============
    console.log(chalk`Analyze of {blue.bold used technologies} started.`);    
    result.technology = technologyAnalyzer.technologyAnalyze(response);
    //=============
    if (!formatJson) {
        formatOutput.print(result);
    } else {
        console.log(JSON.stringify(result, null, 2));
    }
    
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
analyzeWebPage(options.url, options.json, queryOptions);