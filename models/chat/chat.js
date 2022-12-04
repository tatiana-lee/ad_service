const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId;

const chatShema = new Schema({
  users: [
    {
      type: ObjectId,
      require: true,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    require: true,
    default: Date(),
  },
  messages: [
    {
      type: ObjectId,
      ref: 'Message',
    },
  ],
});

module.exports = model('Chat', chatShema);
