const EventEmitter = require('events');
const tvMazeScraper = require('../../controllers/tvMazeScraper');
const logger = require('../../services/logger');


class Scrapper extends EventEmitter {
  constructor() {
    super();
  }

  async run() {
    try {
      await tvMazeScraper.scrapShows();
      await tvMazeScraper.scrapCasts();
    } catch (err) {
      logger.error('Scraping failed. Error emited.');
      this.emit('error', err);
    }

    logger.error('Scraping finished.');
    this.emit('close');
  }
}

module.exports = new Scrapper();
