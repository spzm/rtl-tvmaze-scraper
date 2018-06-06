const debounce = require('./debounce');

/**
 * Special debounce counter to prevent several async
 * actions. It allows to increase counter only after wait delay.
 *
 * @param {Integer} initialCoef initial coefficient
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
