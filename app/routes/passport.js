var passport = require('passport');
//var Member = require('../models/members');

module.exports = function (app) {

  // app.get('/register', function(req, res) {
  //     res.render('register', { });
  // });

  // app.post('/register', function(req, res) {
  //   Member.register(new Member({ username : req.body.username }), req.body.password, function(err, account) {
  //       if (err) {
  //           return res.render('register', { account : account });
  //       }

  //       passport.authenticate('local')(req, res, function () {
  //         res.redirect('/chat');
  //       });
  //   });
  // });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
      res.redirect('/chat');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

};
