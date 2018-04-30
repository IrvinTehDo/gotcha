const models = require('../models');

/* eslint-disable */
const Account = models.Account;
/* eslint-enable */

// renders the store page
const storePage = (req, res) => res.render('store', { csrfToken: req.csrfToken() });

// Handles purchase of more pokeballs
const buyBall = (req, res) => {
  Account.AccountModel.updateRolls(req.session.account._id, req.body.amount);
  console.log(res);
};


module.exports.storePage = storePage;
module.exports.buyBall = buyBall;
