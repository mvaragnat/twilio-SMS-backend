var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    findOrCreate = require('mongoose-findorcreate');


var Member = new Schema({
    username: String,
    password: String,
    admin: {type: Boolean, default: false}
});

Member.plugin(findOrCreate);
Member.plugin(passportLocalMongoose);

module.exports = mongoose.model('Member', Member);
