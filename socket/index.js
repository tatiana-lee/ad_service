const socketIO = require('socket.io');
const ChatModule = require('../models/chat/chatFunctions');
const EventEmitter = require('./eventEmitter');

const event = new EventEmitter();

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

function socket(server, sessionMiddleware) {
  const io = socketIO(server);

  io.use(wrap(sessionMiddleware));

  io.use((socket, next) => {
    const query = socket.handshake.query;
    const sessions = socket.request.sessionStore.sessions;
    const keys = Object.keys(sessions);
    const obj = JSON.parse(sessions[keys[0]]);
    const userId = obj.passport.user;

    socket.data.user = userId;
    socket.data.type = query.type;

    if (!userId) {
      return next(new Error('incorrect session, please relogin'));
    }

    next();
  });

  io.on('connection', (socket) => {
    const { id } = socket;
    const { user, type } = socket.data;
    console.log(`Socket connected: ${id}`);

    let deleteEvent;

    if (type === 'chat') {
      deleteEvent = event.subscribe(type, user, (chat) => {
        socket.emit('newMessage', chat);
      });
    } else {
      deleteEvent = event.subscribe(type, user, () => {
        const chats = ChatModule.getChatsByUserId(user);
        socket.emit('newChatsMessage', chats);
      });
    }

    socket.on('getHistory', (receiverId) => {
      const currentUserId = user;
      const getChatId = ChatModule.findChat([currentUserId, receiverId]);
      const chat = ChatModule.getHistory(getChatId._id);
      socket.emit('chatHistory', chat);
    });

    socket.on('sendMessage', async (data) => {
      const { receiver, text } = data;
      const author = user;
      const chat = await ChatModule.sendMessage({ author, receiver, text });
      console.log(chat);

      chat.users.forEach((user) => {
        event.emit('chat', user.id, chat);
      });

      event.emit('chats', receiver);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${id}`);
      deleteEvent();
    });
  });

  return io;
}

module.exports = socket;
