const chalk = require('chalk');

function formatOutput(analyzedInfo) {
    console.log(chalk`\n\n{bold Results}`)
    console.log(chalk`{yellow.bold ${analyzedInfo.title}}`)
    console.log(chalk`Page size: {whiteBright.bold ${analyzedInfo.size}}`)
    console.log(chalk`Page loading time: {whiteBright.bold ${analyzedInfo.timing}}`)
    
    console.log(chalk`Rank in Alexa {whiteBright ${analyzedInfo.alexaInfo.rank}}`)
    if (analyzedInfo.isInBlackList) {
        console.log(`{red.bold Is in black list}`);
    } else {
        console.log(chalk`{green.bold Is not in black list}`);
    }

    if (!analyzedInfo.fullyHttps) {
        console.log(chalk`{red.bold Is not fully HTTPS}`)
    } else {
        console.log(chalk`{green.bold Is fully HTTPS }`)
    }
    
    if (analyzedInfo.technology.server) {
        console.log(chalk`Server used: {whiteBright ${analyzedInfo.technology.server}}`)
    }
    
    if (analyzedInfo.technology.technology) {
        console.log(chalk`Technology powered by: {whiteBright ${analyzedInfo.technology.technology}}`)
    }
    
    if (analyzedInfo.resources.fullSize) {
        console.log(chalk`Full imported files size: {whiteBright ${analyzedInfo.resources.fullSize} bytes}`)
    }
    if (analyzedInfo.resources.notCachedSize) {
        console.log(chalk`Not caching imported files size: {whiteBright ${analyzedInfo.resources.notCachedSize} bytes}`)
    }


    // if (analyzedInfo.resources) {
    //     console.log(resources);
    // }
}

exports.print = formatOutput;