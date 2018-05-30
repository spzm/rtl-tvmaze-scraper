const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('../../../configuration');
const logger = require('../../services/logger');
const { checkConnection } = require('../database/db');
const { createRoutes } = require('./v0/routes');

const router = express.Router();
const app = express();


app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(express.json());

app.use(morgan('combined', { stream: logger.stream }));

router.use((req, res, next) => {
  if (checkConnection()) return next();
  res.status(500).json({code: 500, message: 'DB is offline'});
});


router.all('/', (req, res, next) => {
  const rootInfo = {
    'show casts': `${config.get('endpoints:base')}/api/v0/showCast?page=0&size=250`,
    'sync tyme': config.get('scraper:jobSchedule')
  };
  res.json(rootInfo);
});

const routerV0 = createRoutes();

app.use('/', router);
app.use('/api/v0', router);
app.use('/api/v0', routerV0);


module.exports = app;
