const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  author: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  sentAt: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  readAt: {
    type: Date,
  },
});

module.exports = model('Message', messageSchema);
