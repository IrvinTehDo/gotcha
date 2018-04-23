const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPokes', mid.requiresLogin, controllers.Poke.getPokes);
  app.get('/getRecentCatch', mid.requiresLogin, controllers.Poke.getRecentCatch);
  app.get('/getCatchPageInfo', mid.requiresLogin, controllers.Poke.getCatchPageInfo);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePassPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/view', mid.requiresLogin, controllers.Poke.makerPage);
  app.get('/catch', mid.requiresLogin, controllers.Poke.catchPage);
  app.post('/catch', mid.requiresLogin, controllers.Poke.make);
  app.get('/store', mid.requiresLogin, controllers.Store.storePage);
  app.post('/buyBall', mid.requiresLogin, controllers.Store.buyBall);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
