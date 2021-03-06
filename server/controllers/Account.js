const models = require('../models');

/* eslint-disable */
const Account = models.Account;
/* eslint-enable */

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const changePassPage = (req, res) => {
  res.render('changePassword', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // Can create new strings or store in req.body
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/view' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // Cast params to strings for the sake of security
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/view' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

// Handles change request process
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  console.dir(req.session.account.username);

    // Check if new pass matches
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

    // Make sure user's password is correct before moving on
  return Account.AccountModel.authenticate(
    req.session.account.username,
    req.body.oldPass,
    (err, account) => {
      if (err || !account) {
        console.log('wrong pass');
        console.log(`${req.session.account.username} | ${req.body.oldPass}`);
        return res.status(401).json({ error: 'Wrong passsword' });
      }

        // Save password to account
      return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
        const acc = account;
        acc.password = hash;
        acc.salt = salt;

        const savePromise = account.save();

        savePromise.then(() => {
          req.session.account = Account.AccountModel.toAPI(account);
          return res.json({ redirect: '/view' });
        });
        savePromise.catch(() => res.status(500).json({ error: 'Unable to change password' }));
      });
    },
  );
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePassPage = changePassPage;
module.exports.changePassword = changePassword;
module.exports.getToken = getToken;
