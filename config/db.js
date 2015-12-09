var mongoose       = require('mongoose');    //database
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/talkative');

// module.exports = {
//         url : urlEnv
//     }
