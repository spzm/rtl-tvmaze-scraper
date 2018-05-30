const mongoose = require('mongoose');

const ShowCast = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true
  },
  name: { type: String, default: '' },
  cast: [{
    id: Number,
    name: { type: String, default: '' },
    birthday: String
  }]
});

ShowCast.statics.findByPage = function(page, pageSize, cb) {
  // To provide jagination by id rather than by number of elements
  const min = (page * pageSize) + 1;
  const max = page * pageSize + pageSize;

  return this
    .find(
      { id: { $gte: min, $lte: max } },
      {
        '_id': false,
        '__v': false,
        'cast._id': false
      },
      cb
    )
    .lean()
    .exec();
};

ShowCast.statics.updateById = function(showId, showData, cb) {
  return this.findOneAndUpdate({ id: showId }, showData, { upsert: true }, cb);
};

const ShowCastModel = mongoose.model(
  'ShowCast',
  ShowCast
);


module.exports = ShowCastModel;

