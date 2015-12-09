// grab the mongoose module
var mongoose = require('mongoose');
//and the plugin
var findOrCreate = require('mongoose-findorcreate')

// define our user model
var userSchema = new mongoose.Schema({
    tel : {type : String, default: ''},
    name : {type : String, default: ''},
    unread: {type: Boolean, default: true}
  },
  { timestamps: true }
);

userSchema.plugin(findOrCreate);

var user = mongoose.model("User", userSchema);

// module.exports allows us to pass this to other files when it is called
module.exports = user;
