#!/usr/local/bin/node

const startup = require('./start_up');
const options = startup.startUp();
if (!options) {
    return
}

const chalk = require('chalk');
const request = require('request-promise-native');

async function analyzeWebPage(url) {
    console.log(chalk`Analyze of {green.bold ${url}} started.`);
    try {
        await request.get(url);
    } catch (error) {
        if (error.message) {
            console.log(error.message);
        } else {
            console.log(error);
        }
    }
}

analyzeWebPage(options.url);

