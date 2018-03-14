const hostnameUtils = require('../utils/hostname');
const normalizeLink = require('../utils/normalize_link').normalizeLink;
_ = require('lodash');
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
    result = {
        fullSize: 0,
        notCachedSize: 0
    }
    if (options.external == true) {
        result.external = {};

        //process external scripts
        if (options.scripts) {
            result.external.Scripts = await processSizeAndCaching(
                processLinks({
                    linksList: webPage.findAll('script'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: false
                }),
                options.requestOptions
            );
            const sizes = getSizes(result.external.Scripts);
            result.fullSize += sizes.full;
            result.notCachedSize += sizes.noncached;
        }
        //process external styles
        if (options.styles) {
            result.external.Styles = await processSizeAndCaching(
                processLinks({
                    linksList: webPage.findAll('link', {rel:"stylesheet"}),
                    attributeName: 'href',
                    parentLink: url,
                    sameHostname: false
                }),
                options.requestOptions
            );
            const sizes = getSizes(result.external.Styles);
            result.fullSize += sizes.full;
            result.notCachedSize += sizes.noncached;
        }

        //process external images
        if (options.images) {
            result.external.Images = await processSizeAndCaching(
                processLinks({
                    linksList: webPage.findAll('img'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: false
                }),
                options.requestOptions
            );
            const sizes = getSizes(result.external.Images);
            result.fullSize += sizes.full;
            result.notCachedSize += sizes.noncached;
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
            result.internal.Scripts = await processSizeAndCaching(
                processLinks({
                    linksList: webPage.findAll('script'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: true
                }),
                options.requestOptions
            );
            const sizes = getSizes(result.internal.Scripts);
            result.fullSize += sizes.full;
            result.notCachedSize += sizes.noncached;
        }
        //process internal styles
        if (options.styles) {
            result.internal.Styles = await processSizeAndCaching(
                processLinks({
                    linksList: webPage.findAll('link', {rel:"stylesheet"}),
                    attributeName: 'href',
                    parentLink: url,
                    sameHostname: true
                }),
                options.requestOptions
            );
            const sizes = getSizes(result.internal.Styles);
            result.fullSize += sizes.full;
            result.notCachedSize += sizes.noncached;
        }
        //process internal images
        if (options.images) {
            result.internal.Images = await processSizeAndCaching(
                processLinks({
                    linksList: webPage.findAll('img'),
                    attributeName: 'src',
                    parentLink: url,
                    sameHostname: true
                }),
                options.requestOptions
            );        
            const sizes = getSizes(result.internal.Images);
            result.fullSize += sizes.full;
            result.notCachedSize += sizes.noncached;
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


async function processSizeAndCaching(linksList, requestOptions) {
    const resultList = [];
    for (let link of linksList) {
        try {
            const options = Object.assign({
                    url: link, 
                    resolveWithFullResponse: true,
                    method:"OPTIONS"
                },  requestOptions);
            let result = await request.get(options);
            if (!result.headers['content-length']) {
                options.method = "GET";
                result = await request.get(options);
            }            
            const output = {
                url: link,                 
                length: parseInt(result.headers['content-length']),
                caches: (result.headers['cache-control']||"").indexOf("max-age") != -1
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
    
    return _.sortedUniq(options.linksList.map(elem => elem.attrs[options.attributeName]).
    filter(elem => elem && 
        elem[0] != '#' && 
        elem.slice(0,5) != 'data:' && 
        elem.slice(0,11) != 'javascript:' && 
        elem.slice(0,4) != 'tel:' && 
        elem.slice(0,7) != 'mailto:' && 
        elem.slice(0,6) != 'skype:' && 
        (hostnameUtils.isSameHostName(options.parentLink, elem) == options.sameHostname))
    ).map(elem => normalizeLink(options.parentLink, elem));
}

function getSizes(linksList) {
    return linksList.reduce((acc, elem) => {
        acc.full += (elem.length || 0);
        if (!elem.caches) {
            acc.noncached += (elem.length || 0);
        }            
        return acc
    }, {
        noncached: 0,
        full: 0
    })
}


exports.analyzeExternalResources = analyzeExternalResources;