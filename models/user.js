var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  local: {
    email: String,
    password: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  }
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// exporting model for app
module.exports = mongoose.model('User', userSchema);
