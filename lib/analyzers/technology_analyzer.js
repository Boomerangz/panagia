function technologyAnalyze(response) {
    const result = {};
    if (response.headers['server']) {
        result.server = response.headers['server'];
    }
    if (response.headers['x-powered-by']) {
        result.technology = response.headers['x-powered-by'];
    }
    return result;
}

exports.technologyAnalyze = technologyAnalyze;