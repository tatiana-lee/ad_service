const express = require('express');
const ChatModule = require('../models/chat/chatFunctions');
const Chat = require('../models/chat/chat');

const app = express();

app.get('/', async (req, res) => {
  const chats = await Chat.find().populate('messages');
  res.json(chats);
});

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id).populate('messages');
  res.json(chat);
});

app.post('/', async (req, res) => {
  const { id } = req.user;
  const { receiver, text } = req.body;
  if (!receiver) {
    res.status(400).json({
      error: 'не передан собеседник',
      status: 400,
    });
  }
  const chat = await ChatModule.sendMessage({ author: id, receiver, text });
  console.log(chat);
  res.json(chat);
});

module.exports = app;
