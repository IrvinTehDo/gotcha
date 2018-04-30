const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  rolls: {
    type: Number,
    default: 5,
  },
  rareCandy: {
    type: Number,
    default: 0,
  },
  lastFreePokeaballUsed: {
    type: Date,
    default: 0,
  },
});

AccountSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex')));
};

AccountSchema.statics.authenticate = (username, password, callback) =>
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });

// Does a query based on the _id of a user and grabs how many candies a user has.
AccountSchema.statics.getCandy = user => AccountModel.findOne({ _id: user }, { rareCandy: 1 });

// Updates amount of candy a user has based on amount
AccountSchema.statics.updateCandy = (user, amount, callback) => {
  const update = {
    $inc: { rareCandy: amount },
  };

  try {
    AccountModel.findByIdAndUpdate(user, update, (err) => {
      if (err) {
        return callback(err);
      }
      return callback(null);
    });
  } catch (e) {
    console.log(e);
    return callback(e);
  }

  return callback();
};

// Same as getCandy except with rolls/pokeballs
AccountSchema.statics.getRolls = user => AccountModel.findOne({ _id: user }, { rolls: 1, lastFreePokeaballUsed: 1 });

// Same as updateCandy except with rolls/pokeballs
AccountSchema.statics.updateRolls = (user, amount, lastFree) => {
  let update = {};
  console.log(`Subtract: ${Date.now() - lastFree}`);

  if (Date.now() - lastFree > 3600000) {
    update = {
      $set: { lastFreePokeaballUsed: Date.now() },
    };
  } else {
    update = {
      $inc: { rolls: amount },
    };
  }

  try {
    //    AccountModel.updateOne({ _id: user }, { $inc: { rolls: amount } });
    AccountModel.findByIdAndUpdate(user, update, (err, doc) => {
      console.log(doc);
    });
  } catch (e) {
    console.log(e);
  }
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
