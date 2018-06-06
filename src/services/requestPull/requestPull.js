const { promisify } = require('util');
const wait = promisify(setTimeout);
const logger = require('../logger');

class RequestPull {
  constructor(batchCount = 3, timeout = 1000) {
    this.pull = [];
    this.batchCount = batchCount;
    this.timeout = timeout;
    this.finished = true;
  }

  add(request) {
    if (!request) return;

    this.pull.push(request);
  }

  isFinished() {
    return this.finished;
  }

  changeWait(wait) {
    this.timeout = wait;
  }

  async start() {
    this.finished = false;

    while (this.pull.length > 0) {
      // Get requests batch to execute. If some of request fails
      // then whole batch will be executed again.
      const requests = this.pull.slice(0, this.batchCount);

      try {
        await this.runRequests(requests);
        await wait(this.timeout);
      } catch (err) {
        logger.error(`Request pull run error: ${err}`);
        throw err;
      }

      // Remove successfully finished requests batch.
      this.pull.splice(0, this.batchCount);
    }

    this.finished = true;
  }

  async runRequests(requests) {
    return Promise.all(requests.map(request => request()));
  }
}

module.exports = RequestPull;
