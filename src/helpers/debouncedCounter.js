const debounce = require('./debounce');

/**
 * Special debounced counter to prevent several async
 * actions increas the coef several times.
 *
 */
class DebouncedCounter {
  constructor(initialCoef, wait = 100) {
    this.timeoutCoef = 1;

    this.increaseTimeout = debounce(this.increaseTimeout, wait);
  }

  getCoef() {
    return this.timeoutCoef;
  }

  increaseTimeout() {
    this.timeoutCoef *= 2;
  }
}

module.exports = DebouncedCounter;
