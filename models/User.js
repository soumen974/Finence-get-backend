const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type:String},
  email: { type: String, required: true, unique: true },
  mobile_number:{type:String},
  password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);