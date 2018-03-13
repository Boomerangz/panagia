const hostnameUtils = require('../utils/hostname');
const normalizeLink = require('../utils/normalize_link').normalizeLink;
require('../utils/array_unique');
const request = require('request-promise-native');

/** function for analyzing webpage imported resources such as styles, scripts, etc
 * input parameters are:
 * webPage - jssoup parsed webpage instance
 * url - URL of webpage
 * options - object with parameters to process, all of them are boolean:
 *  - internal, external
 *  - scripts, styles, images, links, iframes
 */
async function analyzeExternalResources(webPage, url, options) {
    //checking for external loading resources
    result = {}
    if (options.external == true) {
        result.external = {}

        //process external scripts
        if (options.scripts) {
            result.external.Scripts = await processSizeAndTiming(
                processLinks({
                    linksList: webPage.findAll('script'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: false
                }),
                options.requestOptions
            );
        }
        //process external styles
        if (options.styles) {
            result.external.Styles = await processSizeAndTiming(
                processLinks({
                    linksList: webPage.findAll('link', {rel:"stylesheet"}),
                    attributeName: 'href',
                    parentLink: url,
                    sameHostname: false
                }),
                options.requestOptions
            );
        }

        //process external images
        if (options.images) {
            result.external.Images = await processSizeAndTiming(
                processLinks({
                    linksList: webPage.findAll('img'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: false
                }),
                options.requestOptions
            );
        }
        //process external links
        if (options.links) {
            result.external.Links = processLinks({
                    linksList: webPage.findAll('a'),
                    attributeName: 'href',
                    parentLink: url,
                    sameHostname: false
            });
        }
        //process external iframes
        if (options.iframes) {
            result.external.Iframes = processLinks({
                linksList: webPage.findAll('iframe'),
                attributeName: 'src',
                parentLink: url,
                sameHostname: false
            });
        }
    }

    //checking for internal loading resources
    if (options.internal == true) {
        result.internal = {}
        //process internal scripts
        if (options.scripts) {
            result.internal.Scripts = await processSizeAndTiming(
                processLinks({
                    linksList: webPage.findAll('script'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: true
                }),
                options.requestOptions
            );
        }
        //process internal styles
        if (options.styles) {
            result.internal.Styles = await processSizeAndTiming(
                processLinks({
                    linksList: webPage.findAll('link', {rel:"stylesheet"}),
                    attributeName: 'href',
                    parentLink: url,
                    sameHostname: true
                }),
                options.requestOptions
            );
        }
        //process internal images
        if (options.images) {
            result.internal.Images = await processSizeAndTiming(
                processLinks({
                    linksList: webPage.findAll('img'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: true
                }),
                options.requestOptions
            );
        }
        //process internal links
        if (options.links) {
            result.internal.Links = processLinks({
                    linksList: webPage.findAll('a'),
                    attributeName: 'href',
                    parentLink: url,
                    sameHostname: true
            });
        }
        //process internal iframes
        if (options.iframes) {
            result.internal.Iframes = processLinks({
                linksList: webPage.findAll('iframe'),
                attributeName: 'src',
                parentLink: url,
                sameHostname: true
            });
        }
    }
    return result;
}

async function processSizeAndTiming(linksList, requestOptions) {
    const resultList = [];
    for (let link of linksList) {
        try {
            const options = Object.assign({
                    url: link, 
                    time:true, 
                    resolveWithFullResponse: true
                },  requestOptions);
            const result = await request.get(options);
            const output = {
                url: link,                 
                timing: result.elapsedTime,
                length: result.body.length
            };
            resultList.push(output);
        } catch (e) {
            console.log(e);
        }
    }
    return resultList;
}

function processLinks(options) {
    //linksList, attributeName, parentLink, sameHostname
    return options.linksList.map(elem => elem.attrs[options.attributeName]).
    filter(elem => elem && 
        elem[0] != '#' && 
        elem.slice(0,5) != 'data:' && 
        elem.slice(0,11) != 'javascript:' && 
        (hostnameUtils.isSameHostName(options.parentLink, elem) == options.sameHostname)).
    unique().
    sort().
    map(elem => normalizeLink(options.parentLink, elem));
}

exports.analyzeExternalResources = analyzeExternalResources;