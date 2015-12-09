// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);         //real-time chat
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');

// configuration ===========================================

// public folder for images, css,...
app.use(express.static(__dirname + '/public'))

// config files
// database
var db = require('./config/db');
//  models
var User = require('./app/models/users');
var Message = require('./app/models/messages');

//parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing url encoded

//AUTH========================================================
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'white rabbit',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
var Member = require('./app/models/members');
passport.use(new LocalStrategy(Member.authenticate()));
passport.serializeUser(Member.serializeUser());
passport.deserializeUser(Member.deserializeUser());

// view engine ejs
app.set('view engine', 'ejs');

//chat namespace
var chatSocket = io.of('/chat')

//routes
require('./app/routes/routes')(app, chatSocket);

//Heroku port
app.set('port', (process.env.PORT || 5000));

//ADMIN====================================================
//create an admin account if none exists
var admin = Member.find({admin: true}, function(err, admins) {
  if (err) throw err

  else if(admins.length == 0){
    //no admin. create default account
    Member.register(new Member({username: "admin", admin: true}), "mypassword", function(err, admin){
      if(err) throw err;
      console.log('Defaut account created successfully!');
    })
  }

  else{
    //at least one admin exists
    console.log('Admin account already exists : ');
    console.log(admins)
  }
});

//START ===================================================
http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});

//SOCKET ==================================================
require('./app/controllers/socket')(chatSocket, User, Message);
