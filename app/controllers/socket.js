module.exports = function(chatSocket, User, Message) {

  var broadcastUsers = function(){
    //renvoyer la liste des utilisateurs
    User.find(function (err, users) {
      if (err) return console.error(err);
      console.log("users : ");
      console.log(users);
      chatSocket.emit("get users", users);
    });
  }

  chatSocket.on('connection', function(socket){
    //a browser using the io() function connects
    console.log('a user connected to page SMS');

    //message sent from browser------------------------------------------------
    socket.on('message', function(data){
      //sauvegarder le message et l'utilisateur
      var number = data.number
      var body = data.message

      //trouver l'utilisateur ou le créer
      var user = User.findOrCreate({"tel": number}, function(err, user, created) {
        if(created){
          console.log('User ' + number + ' saved successfully!');
          //puis renvoyer ts les utilisateurs
          broadcastUsers();
        }
        else{
          console.log('User ' + number + ' already exists');
        }
      });

      var message = new Message({"tel": number, "body": body, "received": false})
      message.save(function(err) {
        if (err) throw err;
        console.log('Message ' + body + ' to ' + number + ' saved successfully!');
      });

      //afficher le message chez tous les clients qui affichent cette conversation
      chatSocket.emit('message', body, number, false, message.createAt);

      //on envoie le SMS
      //require the Twilio module and create a REST client
      var Twilio = require('../../config/twilio')
      var client = require('twilio')(Twilio.account_id, Twilio.auth_token);

      //Send an SMS text message
      client.sendMessage({
          to: number, // Any number Twilio can deliver to
          from: Twilio.number, // A number you bought from Twilio and can use for outbound SMS
          body: body // body of the SMS message

      }, function(error, responseData) { //this function is executed when a response is received from Twilio
          if (error) {
            //errors can be "Invalid number", "Cannot deliver SMS to that number", for example
            console.log(error.message);
          }
          else {
            //console.log(responseData.messageStatus);
          }
      });
    });

    //get one user (ie full conversation)-------------------------------------
    socket.on('get conversation', function(tel){
      console.log("get conversation");

      //renvoyer la liste des messages
      Message.find({"tel": tel}, function (err, messages) {
        if (err) return console.error(err);
        console.log("messages : ");
        console.log(messages);

        //renvoyer aussi le user
        User.findOne({"tel": tel}, function (err, user) {
          if (err) return console.error(err);
          console.log("user : ");
          console.log(user);

          //utiliser .to(socket.id) pour ne renvoyer qu'au demandeur
          chatSocket.to(socket.id).emit("get conversation", messages, user);
        });
      });
    });

    //get list of users--------------------------------------------------------
    socket.on('get users', function(){
      broadcastUsers();
    });

    //mark conversation as read------------------------------------------------
    socket.on('mark as read', function(number){
      User.where({tel: number}).update({ $set: {unread: false} }, function(error, result){
        console.log("mark conversation with " + number + " as read");
        console.log(result);
      });
    });

    //create new conversation--------------------------------------------------
    socket.on('new conversation', function(number){
      //trouver l'utilisateur ou le créer (as read)
      User.findOrCreate({"tel": number}, {unread: false}, function(err, user, created) {
        if(created){
          console.log('User ' + number + ' saved successfully!');

          //renvoyer la liste des utilisateurs (attention, different de broadcastUsers)
          User.find(function (err, users) {
            if (err) return console.error(err);
            console.log("users : ");
            console.log(users);
            //utiliser .to(socket.id) pour ne renvoyer qu'au demandeur
            //à la reception il demande "get users" pour mettre à jour la liste chez tt le monde
            chatSocket.to(socket.id).emit("new conversation", users, number);
          });
        }
        else{
          console.log('Did not create a new user');
        }
      });
    });

    //add name to current user-------------------------------------------------
    socket.on('add name', function(name, number){
      User.where({tel: number}).update({ $set: {name: name} }, function(error, result){
        console.log("Name changed to " + name);
        console.log(result);
      });

      //puis renvoyer ts les utilisateurs
      broadcastUsers();
    });

    //the socket also fires a disconnect event---------------------------------
    socket.on('disconnect', function(){
      console.log('user disconnected from chat page');
    });
  });
}
