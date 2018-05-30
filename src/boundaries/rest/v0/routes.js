const { Router } = require('express');
const {
  getShowCast
} = require('../../../controllers/showCast/showCast.handler');

function createRoutes() {
  const router = new Router();

  router.get('/showCast', getShowCast);

  return router;
}

module.exports = {
  createRoutes
};
