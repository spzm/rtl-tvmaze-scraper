const Logger = require('../../services/logger');
const config = require('../../../configuration');
const mongoose = require('mongoose');
const { promisify } = require('util');

mongoose.Promise = Promise;

const wait = promisify(setTimeout);
let db = null;
let retryCount = 0;

async function start() {
  if (retryCount >= config.get('db:reconnectCount')) {
    throw new Error('Too many reconnect to DB');
  }

  mongoose.connection.on('error', function(error) {
    Logger.error(`DB connection error: ${error}`);
  });

  mongoose.connection.once('open', function() {
    Logger.info('DB is connected');
  });

  mongoose.connection.once('close', function() {
    Logger.info('DB is closed');
  });

  try {
    db = await mongoose.connect(config.get('db:connection'));
  } catch (err) {
    Logger.error(`Connection error. Try to reconnect. ${err}`);

    retryCount += 1;
    await wait(config.get('db:reconnectTimeout'));
    start();
  }
}

function checkConnection() {
  const mogooseConnectedStatus = 1;
  return db.connection.readyState === mogooseConnectedStatus;
}

async function stop() {
  await db.connection.close();
  db = null;
}


module.exports = {
  start,
  stop,
  checkConnection
};


