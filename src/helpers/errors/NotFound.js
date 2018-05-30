class NotFoundError extends Error {
  constructor(message = 'Resource not found.') {
    super(message, 404);
    Object.defineProperty(this, 'name', {
      value: 'NotFound'
    });
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = NotFoundError;
