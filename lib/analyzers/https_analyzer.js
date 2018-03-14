function isFullyHttps(resources) {
    const keys = ['internal', 'external'];
    for (const key of keys) {
        if (!resources[key]) {
            continue
        }
        for (const [resourceName, resourceList] of Object.entries(resources[key])) {
            for (const link of resourceList) {
                if (typeof(link) == 'string' && link.slice(0,6) != "https:") {
                    return false
                } else if  (typeof(link) == 'object' && link.url.slice(0,6) != "https:") {
                    return false
                }
            }
        }
    }
    return true;
}

exports.isFullyHttps = isFullyHttps;