var User = require('../models/users');
var Message = require('../models/messages');
var pushConfig = require('../../config/pushover');
var Pushover = require('pushover-notifications');

// frontend routes =========================================================
module.exports = function(app, chatSocket) {

  app.get('/chat', function(req, res) {

      if(req.user){
        console.log("logged in")
        res.render('chat'); // load views/chat.html file
      }
      else{
        console.log("not logged in")
        res.redirect('/login')
      }
  });

  // Twilio route ==========================================================

  //receive a new SMS
  app.post('/receive', function(req, res){

    body = req.body.Body;
    number = req.body.From;

    //find User, or create a new one
    var user = User.findOrCreate({"tel": number}, function(err, user, created) {
      if(created){
        console.log('User ' + number + ' saved successfully!');
      }
      else{
        //mark conversation as unread
        user.update({$set: {unread: true}}, function(error, result){
          console.log('User ' + number + ' already exists (has been marked unread)');
        });
      }
      //send back list of users
        User.find(function (err, users) {
          if (err) return console.error(err);
          console.log("users : ");
          console.log(users);
          chatSocket.emit("get users", users);
        });
    });

    //save message
    var message = new Message({tel: number, body: body, received: true})
    message.save(function(err) {
      if (err) throw err;

      console.log('Message ' + body + ' from ' + number + ' saved successfully!');
    });

    //sent back to all clients
    chatSocket.emit('message', body, number, true, message.createAt);

    //send pushover notification
    // var pushover = new Pushover({
    //   user: '', //défini après
    //   token: pushConfig.token,
    // });

    // var msg = {
    //   // These values correspond to the parameters detailed on https://pushover.net/api
    //   message: "From " + number + " : " + body,   // required
    //   title: "Message received",
    //   sound: 'magic',
    //   priority: 1
    // };

    // for ( var i = 0, l = pushConfig.users.length; i < l; i++ ) {
    //   msg.user = pushConfig.users[i];

    //   pushover.send( msg, function( err, result ) {
    //     if ( err ) { throw err; }
    //     console.log( result );
    //   });
    // }

    //send back empty response, just to avoid hanging the request
    res.send('<Response></Response>'); //empty response = do nothing
  });

  // auth routes =================================================
  require(__dirname + '/passport')(app);
};
