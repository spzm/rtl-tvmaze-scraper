const nodeSchedule = require('node-schedule');
const scraper = require('./scraper');
const logger = require('../../services/logger');
const config = require('../../../configuration');

let scheduledJob;

function start() {
  return new Promise((resolve, reject) => {
    if (config.get('scraper:runOnStart')) {
      scraper.run();
    }
    scheduledJob = nodeSchedule.scheduleJob(
      config.get('scraper:jobSchedule'),
      () => {
        scraper.run();
      }
    );
    logger.info('Scraper job scheduled');
    resolve();
  });
}

function stop() {
  scheduledJob.cancel();
  logger.info('Scraper job removed');
}


module.exports = {
  start,
  stop
};
