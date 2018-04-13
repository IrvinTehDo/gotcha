const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PokeModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = name => _.escape(name).trim();

const PokeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  level: {
    type: Number,
    min: 0,
    required: true,
  },

  id: {
    type: String,
    required: true,
  },

  img: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PokeSchema.statics.toAPI = doc => ({
  name: doc.name,
  level: doc.level,
  id: doc.id,
  img: doc.img,
});

PokeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PokeModel.find(search).select('name level id img').exec(callback);
};

PokeSchema.statics.deleteById = (uniqueId) => {
  const search = {
    _id: uniqueId,
  };

  return PokeModel.remove(search, 1);
};

PokeModel = mongoose.model('Poke', PokeSchema);

module.exports.PokeModel = PokeModel;
module.exports.PokeSchema = PokeSchema;
