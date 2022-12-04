const Chat = require('./chat');
const Message = require('./message');
const User = require('../user/user');

exports.findChat = async (users) => {
  const result = await Chat.find({
    users: { $all: users },
  })
    .select('-__v')
    .populate('messages');
  try {
    return result[0];
  } catch (error) {
    return error;
  }
};

exports.sendMessage = (data) => {
  return new Promise((resolve, reject) => {
    const createNewMessage = async (data) => {
      const { author, receiver, text } = data;
      const newMessage = new Message({
        author: author,
        sentAt: Date(),
        text: text,
      });
      await newMessage.save();

      try {
        const chat = await Chat.findOne({
          users: { $all: [author, receiver] },
        }).populate('messages');

        if (!chat) {
          const authorId = await User.findById(author).select('_id name');
          const receiverId = await User.findById(receiver).select('_id name');
          const newChat = new Chat({
            users: [authorId, receiverId],
            createdAt: Date(),
          });
          newChat.messages.push(newMessage);
          await newChat.save();
          return newChat;
        }
        chat.messages.push(newMessage);
        chat.save();
        console.log(chat);
        return chat;
      } catch (error) {
        return error;
      }
    };

    const newMessageToChat = createNewMessage(data);
    if (newMessageToChat) {
      resolve(newMessageToChat);
    } else {
      reject(null);
    }
  });
};

exports.getChatsByUserId = async (id) => {
  const chats = await Chat.find({ users: { $in: [id] } })
    .populate([
      {
        path: 'messages',
        select: '-__v',
        transform: normalizeMessage,
      },
      {
        path: 'users',
        select: 'name',
        transform: ({ name }, id) => {
          return { name, id };
        },
      },
    ])
    .select('-__v -createdAt');
  return chats;
};

exports.getHistory = async (id) => {
  const chat = await Chat.findById(id).populate('messages');
  try {
    return chat;
  } catch (error) {
    return error;
  }
};
