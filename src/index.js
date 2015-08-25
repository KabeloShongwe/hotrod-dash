'use strict';

var args = process.argv.slice(2);
var prodMode = args.length > 0 && args[0] === '--prod';

var hotrodDash = require('hotrod-dash-api');
var path = require('path');
var logger = require('hotrod-logger')('box-dash');
var config = require('./config');
var bodyParser = require('body-parser');

var webAppDir = prodMode
    ? path.join(__dirname, '../.dist')
    : path.join(__dirname, 'webApp');
logger.info('Using webapp dir:', webAppDir);

var dashApp = hotrodDash(config, function() {
    return {
        webAppDir: webAppDir,
        routerOptions: require('./api/apiRouterOptions'),
        customClientConfig: {
            chartRefreshSecs: parseInt(config.get('CHART_REFRESH_SECS') || '0'),
            targetAggBuckets: parseInt(config.get('TARGET_AGG_BUCKETS')),
            maxAggBuckets: parseInt(config.get('MAX_AGG_BUCKETS')),
            esStatusCheckDelay: parseInt(config.get('ES_STATUS_CHECK_DELAY'))
        }
    };
});

dashApp.use(bodyParser.json());

var port = process.env.PORT || 3000;
dashApp.listen(port);
logger.info('Running on port', port);

// Start Jobs
var configureJobs = require('./api/jobs/configureJobs');
configureJobs();
