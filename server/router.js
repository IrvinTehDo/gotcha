const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPokes', mid.requiresLogin, controllers.Poke.getPokes);
  app.get('/getRecentCatch', mid.requiresLogin, controllers.Poke.getRecentCatch);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/view', mid.requiresLogin, controllers.Poke.makerPage);
  app.get('/catch', mid.requiresLogin, controllers.Poke.catchPage);
  app.post('/catch', mid.requiresLogin, controllers.Poke.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
