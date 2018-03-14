# panagia

## Your 2K18 Website Analyzing tool

#### *(Not really)*

### Install:
`npm install -g git+https://git@github.com/Boomerangz/panagia.git`

### Run:
`panagia --url <any url>`

### Help:
`panagia --help`


### Possible commandline parameters
`--url <url>` The web page URL address

`--json <true/false>` Print detailed output as json. If not, output will be prettified

`--browser <true/false>` Work with random real browser User Agent

`--user-agent <user-agent string>`   Work with custom User Agent header

`--help`  Print help message

### Check list:
* Page size
* Page loading time
* Alexa Rank
* Black listing
* Fully HTTPS or not
* Server user
* Technology used(by headers check)
* Summary imported files size
* Summary non caching imported files size


###TODO
* Analyze web-page after JS executing
* Listing of WebAPI methods used by JS
* Checking of nested Iframes
* Checking of dynamic redirects