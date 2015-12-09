// User routes ===========================================================
var User = require('../models/users');
var users = require('../controllers/users');

module.exports = function(app) {

  // handle things like api calls
  // authentication routes

  // sample api route
  // app.get('/api/users', function(req, res) {
  //     // use mongoose to get all users in the database
  //     User.find(function(err, users) {

  //         // if there is an error retrieving, send the error.
  //         // nothing after res.send(err) will execute
  //         if (err)
  //             res.send(err);

  //         res.json(users); // return all users in JSON format
  //     });
  // });

  // route to handle creating goes here (app.post)
  // route to handle delete goes here (app.delete)
  //
  //REST routes ==============================================================

  //Create new (expect POST params "tel" et "name")
  //app.route('/users').post(users.create);
}
