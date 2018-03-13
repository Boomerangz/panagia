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
