const commandLineUsage = require('command-line-usage')
const sections = [
    {
    header: 'Web page analyze app',
    content: 'A tool for general static analyzing of web pages'
    },
    {
    header: 'Options',
    optionList: [
        {
        name: 'url',
        typeLabel: '<url>',
        description: 'The web page URL address'
        },
        {
        name: 'browser',
        typeLabel: '<true/false>',
        description: 'Work with real browser User Agent'
        },
        {
            name: 'user-agent',
            typeLabel: '<user-agent string>',
            description: 'Work with custom User Agent header'
        },
        {
        name: 'help',
        description: 'Print this usage guide.'
        }
    ]
    }
]
const usage = commandLineUsage(sections)


function printHelp() {
    console.log(usage)
}

exports.printHelp = printHelp;
