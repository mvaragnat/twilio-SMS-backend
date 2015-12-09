# Talkative
## Chat interface for multiple Twilio SMS conversations

This app allows you to manage several SMS conversations in a chat-like interface. Useful for technical support, marketing, games, and so on.

It is built on Node.js and Socket.io.

It uses Twilio API and (optionnaly) Pushover for notifications

## Features

The chat interface is a Messenger-like interface with specific functions such as
/create TEL to start a new discussion
/set NAME to add a name to the active discussion (user profile)
/sendall MESSAGE to send a message to all your discussions

It can send notifications to inform you of incoming messages

## Configuration

1. Configure ./confid/twilio.js
```
exports.account_id = "YOUR_TWILIO_ACCOUNT_ID";
exports.secret = "YOUR_TWILIO_SECRET";
// A number you bought from Twilio and can use for outbound communication
exports.number = "YOUR_TWILIO_NUMBER";
```
2. Go to your [Twilio account](https://www.twilio.com/user/account/messaging/phone-numbers) and configure Twilio SMS to /receive.

For example if the app was deployed to myapp.herokuapp.com, your Twilio number should point to myapp.herokuapp.com/receive

## Admin account

Only admins can log into the chat interface. By default, an admin account is configured at startup with username "admin" and password "mypassword". Configure it in server.js.

server.js
```
Member.register(new Member({username: "admin", admin: true}), "mypassword", function(err, admin){
```

New accounts can be opened by un-commenting the /register route in ./routes/passport and adding a register.ejs page in ./views

## Notifications - Optional
You can be notified each time you receive a message. Actually, any number of people can be notified.

1. Un-comment in route.js
```
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
```

2. Add Pushover tokens (app token, as well as a token for each user to notify)

./config/pushover.js
```//API token
exports.token = "YOUR_PUSHOVER_APP_TOKEN";

//userkey
var user1 = "PUSHOVER_USER_1_TOKEN";
var user2 = "PUSHOVER_USER_1_TOKEN";
//etc

exports.users = [user1, user2];
```

## Author
[Matthieu Varagnat](https://fr.linkedin.com/in/matthieuvaragnat)

## Licence
Shared under [MIT licence](http://choosealicense.com/licenses/mit/)
