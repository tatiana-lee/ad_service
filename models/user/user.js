const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please, enter email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please, enter password'],
  },
  name: {
    type: String,
    required: [true, 'Please, enter your name'],
  },
  contactPhone: {
    type: String,
  },
});

module.exports = model('User', userSchema);
