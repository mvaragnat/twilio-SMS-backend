// grab the mongoose module
var mongoose = require('mongoose');

// define our user model
var messageSchema = new mongoose.Schema({
    body: {type : String, default: ''},
    tel: {type: String, default: ''},
    received: {type: Boolean, default: true}
  },
  { timestamps: true }
);

var message = mongoose.model("Message", messageSchema);

// module.exports allows us to pass this to other files when it is called
module.exports = message;
