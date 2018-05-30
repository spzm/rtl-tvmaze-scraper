class TooManyRequests extends Error {
  constructor(message = 'Too Many Requests.') {
    super(message, 429);
    Object.defineProperty(this, 'name', {
      value: 'TooManyRequests'
    });
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = TooManyRequests;
