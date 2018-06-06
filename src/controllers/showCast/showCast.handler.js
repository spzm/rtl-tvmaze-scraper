const Joi = require('joi');
const ShowCastModel = require('./showCast.model');
const compareValuesWithNull = require('../../helpers/compareValuesWithNull');
const config = require('../../../configuration');
const logger = require('../../services/logger');


const scheme = Joi.object().keys({
  page: Joi.number().integer().min(0).required(),
  size: Joi.number().integer().min(1).max(250)
});

const getShowCast = async (req, res, next) => {
  const { query } = req || {};

  const { error, value } = Joi.validate(query, scheme, { stripUnknown: true });

  if (error) {
    logger.error(`Joi validation error: ${error}`);
    res.status(400).json(error.details);
    return;
  }

  const { page, size } = value;

  try {
    const result = await ShowCastModel.findByPage(
      page,
      size || config.get('rest:showCastPageSize')
    );
    const response = result.map(show => {
      if (!Array.isArray(show.cast)) return show;

      return {
        id: show.id,
        name: show.name,
        cast: show.cast.sort(
          (a, b) => compareValuesWithNull(a.birthday, b.birthday)
        )
      };
    });

    res.json(response);
  } catch (err) {
    logger.error(`Error during findByPage: ${err}`);
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
};


module.exports = {
  getShowCast
};
