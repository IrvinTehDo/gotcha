const models = require('../models');

/* eslint-disable */
const Account = models.Account;
/* eslint-enable */

// renders the store page
const storePage = (req, res) => res.render('store', { csrfToken: req.csrfToken() });

// Handles purchase of more pokeballs, for now it just adds 5.
const buyBall = (req, res) => {
  Account.AccountModel.updateRolls(req.session.account._id, 5);
  console.log(res);
};


module.exports.storePage = storePage;
module.exports.buyBall = buyBall;
