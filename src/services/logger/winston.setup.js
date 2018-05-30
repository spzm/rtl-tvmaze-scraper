const winston = require('winston');
const config = require('../../../configuration');

const { combine, timestamp, printf } = winston.format;

const formatForConsole = printf(info => `${config.get('appId')}||${info.timestamp}: (${info.level}) ${info.message}`);

const consoleTransport = new winston.transports.Console({
  format: combine(
    timestamp(),
    formatForConsole
  )
});

const transports = {
  console: consoleTransport
};

const choosedTransports = config.get('logging:transports');

const logger = winston.createLogger({
  level: config.get('logging:level'),
  transports: choosedTransports.map(name => transports[name]).filter(Boolean)
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
