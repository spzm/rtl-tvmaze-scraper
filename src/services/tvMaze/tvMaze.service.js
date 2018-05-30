const config = require('../../../configuration');
const HttpService = require('../httpService');

class TvMaze {
  buildShowByPageUrl(pageNumber = 0) {
    const showEndpoint = config.get('endpoints:shows');

    return `${showEndpoint}?page=${pageNumber}`;
  }

  buildShowCastUrl(showId) {
    const showEndpoint = config.get('endpoints:shows');
    const castEndpoint = config.get('endpoints:cast');

    return `${showEndpoint}/${showId}${castEndpoint}`;
  }

  async fetchShowByPage(pageNumber) {
    const url = this.buildShowByPageUrl(pageNumber);

    return HttpService.get(url);
  }

  async fetchShowCast(showId) {
    const url = this.buildShowCastUrl(showId);

    return HttpService.get(url);
  }
}

module.exports = new TvMaze();
