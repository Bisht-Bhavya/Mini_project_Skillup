const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
name: String,
email: String,
password: String,
skills: [String],
bio: String,
});


module.exports = mongoose.model('User', UserSchema);


// User model only
module.exports = mongoose.model('User', UserSchema);