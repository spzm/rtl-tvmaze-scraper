const fetch = require('node-fetch');
const NotFound = require('../../helpers/errors/NotFound');
const TooManyRequests = require('../../helpers/errors/TooManyRequests');

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }

  if (response.status === 404) {
    return Promise.reject(new NotFound());
  }

  if (response.status === 429) {
    return Promise.reject(new TooManyRequests());
  }

  return Promise.reject(new Error(response.statusText));
}

function json(response) {
  return response.json();
}


class HttpService {
  async get(url) {
    try {
      const result = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      const response = await status(result);
      return json(response);
    } catch (err) {
        return Promise.reject(err);
    }
  }
}

module.exports = new HttpService();
