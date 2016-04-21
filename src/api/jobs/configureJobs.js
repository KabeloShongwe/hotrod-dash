'use strict';

var config = require('../../config');
var jobs = require('hotrod-jobs');
var moment = require('moment');
var esClient = require('../elasticsearch');

var serverStatsUpdateIntervalSeconds = parseInt(config.getRequired('SS_INDEX_UPDATE_INTERVAL_SECS'));

var serverStatsIndexCleanupIntervalSeconds = parseInt(config.getRequired('SS_INDEX_CLEANUP_INTERVAL_SECS'));
var logstashIndexCleanupIntervalSeconds = parseInt(config.getRequired('LS_INDEX_CLEANUP_INTERVAL_SECS'));

var cleanupServerStatsIndices = require('hotrod-job-es-index-cleanup')({
    label: 'delete-serverstats',
    esClient: esClient,
    index: 'serverstats-*',
    skip: parseInt(config.getRequired('SS_INDEX_CLEANUP_SPAN')),
    action: config.get('SS_INDEX_CLEANUP_ACTION') || 'delete',
    whatIf: config.get('SS_INDEX_CLEANUP_WHATIF')
});

var closeLogstashIndices = require('hotrod-job-es-index-cleanup')({
    label: 'close-logstash',
    esClient: esClient,
    index: 'logstash-*',
    skip: parseInt(config.getRequired('LS_INDEX_CLEANUP_SPAN')),
    action: config.get('LS_INDEX_CLEANUP_ACTION') || 'close',
    whatIf: config.get('LS_INDEX_CLEANUP_WHATIF')
});

var serverStatsJob = require('./serverStatsJob')();

module.exports = function() {
#    jobs.runContinuous(serverStatsJob, serverStatsUpdateIntervalSeconds);
#    jobs.runContinuous(cleanupServerStatsIndices, serverStatsIndexCleanupIntervalSeconds);
#    jobs.runContinuous(closeLogstashIndices, logstashIndexCleanupIntervalSeconds);
};
