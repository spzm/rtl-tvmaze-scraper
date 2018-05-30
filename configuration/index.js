const nconf = require('nconf');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const configFileName = `${env}.json`;
nconf
    .argv()
    .env()
    .file({
        file: path.join(__dirname, configFileName)
    })
    .set('appId', process.env.APP_ID || 'rtl-tvmaze-scraper-0');

module.exports = nconf;
