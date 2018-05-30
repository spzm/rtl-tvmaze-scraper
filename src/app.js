const db = require('./boundaries/database/db');
const rest = require('./boundaries/rest');
const scraper = require('./boundaries/scraper');
const logger = require('./services/logger');
const config = require('../configuration');

// This signal will force node to open debug port
process.on('SIGUSER1', () => {
  logger.info('Received debug signal SIGUSER1');
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error(`Unhandled Exception: ${error}`);
  process.exit(1);
});

process.on('warning', (error) => {
  logger.error(`Warning detected: ${error}`);
});

process.on('exit', (code) => {
  logger.info(`Stopped with code: ${code}`);
});

async function bootstrup() {
  logger.info('Starting...');

  ['SIGTERM', 'SIGINT', 'SIGHUP'].forEach(sigEvent => {
    process.on(sigEvent, () => this.stop());
  });

  try {
    await start();
  } catch (error) {
    logger.error(error, 'Error during startup');
    process.exit(1);
  }

  logger.info('Started');
}

async function distruct() {
  logger.info('Stopping...');

  const timeoutId = setTimeout(() => {
    logger.error('Stopped forcefully, awaiting Event Loop');
    process.exit(1);
  }, config.get('shutdownTimeout'));

  try {
    await stop();
    timeoutId.unref();
  } catch (error) {
    logger.error(`Error during shutdown: ${error}`);
    process.exit(1);
  }
}

async function start() {
  await db.start();
  await rest.start();
  await scraper.start();
}

async function stop() {
  await scraper.stop();
  await rest.stop();
  await db.stop();
}

module.exports = {
  start: bootstrup,
  stop: distruct
};
