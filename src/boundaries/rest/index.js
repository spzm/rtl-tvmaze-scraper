const { createServer } = require('http');
const express = require('./express');
const Logger = require('../../services/logger');

let httpServer = null;

function start() {
  httpServer = createServer(express);
  return new Promise((resolve, reject) => {
    httpServer.listen('3005', () => {
      Logger.info(`HTTP Server started @ '3005'`);
      resolve();
    }).once('error', reject);
  });
}

function stop() {
  if (!httpServer.listening) throw new Error('Http Server is not listening');

  return new Promise((resolve, reject) => {
    httpServer.once('close', () => {
      Logger.info('HTTP server stopped.');
      httpServer = null;
      return resolve();
    });

    httpServer.close((err) => {
      if (err) reject(err);
    });
  });
}


module.exports = {
  start,
  stop
};
