const commandLineArgs = require('command-line-args')
const optionDefinitions = [
    { name: 'url', type: String },
    { name: 'browser', type: Boolean },
    { name: 'useragent', type: String },
    { name: 'help', type: String },
    { name: 'json', type: Boolean },
]
const url = require("url");


/** Function of getting parameters for starting the application. 
 * Parsing parameters, validating it etc.
 */
function startUp() {
    const options = commandLineArgs(optionDefinitions);

    //Check if neither of url and help requested
    if (!options.url && !('help' in options)) {
        console.log('at least one of --url or --help parameters is required');
        return
    }

    //Check if help printing requested
    if ('help' in options) {
        require('./help').printHelp();
        return
    }

    //Check if requested url is valid
    const result = url.parse(options.url);
    if (!result.hostname) {
        console.log(`Url ${options.url} is invalid`);
        return
    }

    //Everything is cool, return result
    return options;
}

exports.startUp = startUp;
