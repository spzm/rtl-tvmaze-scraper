const DebouncedCounter = require('../../helpers/debouncedCounter');
const NotFound = require('../../helpers/errors/NotFound');
const RequestPull = require('../../services/requestPull');
const ShowCastModel = require('../showCast/showCast.model');
const TooManyRequests = require('../../helpers/errors/TooManyRequests');
const config = require('../../../configuration');
const logger = require('../../services/logger');
const tvMazeService = require('../../services/tvMaze');

/**
 * This is simplification to build request query.
 *
 */
let showsIds = [];

async function fetchShowAndSave(pageNumber) {
  logger.debug(`Request show page: ${pageNumber}`);
  const shows = await tvMazeService.fetchShowByPage(pageNumber);

  return await Promise.all(shows.map((show) => {
    const showData = {
      id: show.id,
      name: show.name
    };
    showsIds.push(show.id);

    return ShowCastModel.updateById(showData.id, showData);
  }));
}

async function scrapShows(startIndex = 0) {
  let index = startIndex;
  logger.info('Scrapping shows started.');

  const requestPull = new RequestPull(
    config.get('scraper:castSimultaneousRequests'),
    config.get('scraper:showCallsWait')
  );

  let isFinised = false;
  // For production this condition must be reconsidered to stop requests on some not realistic (huge) number.
  // Logic should wait untils some of request fails with 404 that will mean this is the last page.
  while (!isFinised) {
    try {
      const batchCount = 50;
      const batchIndexes = Array.from(
        { length: (index + batchCount) - index },
        (v, k) => k + index
      );

      batchIndexes.forEach(showIndex => {
        requestPull.add(() => fetchShowAndSave(showIndex));
      });

      await requestPull.start();

      index += batchCount;
    } catch (err) {
      // From tvMaze docs they will return 404 if such show page
      // doesn't exist. I assume scraping is finished when receive such request.
      if (err instanceof NotFound) {
        logger.info('Scrapping shows finished.');
        isFinised = true;
        break;
      }

      // Clear all id's to prevent scraping casts by it
      showsIds = [];
      throw err;
    }
  }
}

async function fetchCastAndSave(id) {
  logger.debug(`Request cast with showId: ${id}`);
  const cast = await tvMazeService.fetchShowCast(id);
  const castData = cast
    .map(cast => ({
        id: cast.person && cast.person.id,
        name: cast.person && cast.person.name,
        birthday: (cast.person && cast.person.birthday) || null
    }));

  const showData = {
    id: id,
    cast: castData
  };

  return ShowCastModel.updateById(id, showData);
}

async function scrapCasts() {
  if (!Array.isArray(showsIds) && showsIds.length === 0) {
    logger.warn('No show ids provided for scraping casts');
    return;
  }
  logger.info('Scrapping casts started.');

  const startCounter = 1;
  const counter = new DebouncedCounter(
    startCounter,
    config.get('scraper:castDebounceWait')
  );
  const requestPull = new RequestPull(
    config.get('scraper:castSimultaneousRequests'),
    config.get('scraper:castCallsWait')
  );

  showsIds.forEach(showIndex => {
    requestPull.add(() => fetchCastAndSave(showIndex));
  });

  do {
    requestPull.changeWait(
      config.get('scraper:castCallsWait') * counter.getCoef()
    );
    try {
      await requestPull.start();
    } catch (err) {
      if (err instanceof TooManyRequests) {
        counter.increaseTimeout();
        logger.warn(`Too many requests. Increase wait timeout. Now ${config.get('scraper:castCallsWait') * counter.getCoef()}`);
        continue;
      }

      throw err;
    }
  } while (!requestPull.isFinished());

  logger.info('Scrapping casts finished.');
  showsIds = [];
}

module.exports = {
  scrapShows,
  scrapCasts
};
