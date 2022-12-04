const express = require('express');
const imageMiddleware = require('../middleware/image');
const AdModule = require('../models/ad/adFunctions');
const Advertisement = require('../models/ad/ad');

const checkAuthenticated = require('../middleware/checkAuthenticated');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const ads = await Advertisement.find()
    .select('-__v')
    .populate('user', 'name');
  try {
    res.json({ data: ads, status: 'ok' });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await Advertisement.findById(id)
      .select('-__v')
      .populate('user', 'name');
    res.json({ data: ad, status: 'ok' });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post(
  '/',
  checkAuthenticated,
  imageMiddleware.array('images'),
  async (req, res) => {
    try {
      const { shortText, description } = req.body;
      const user = req.user;
      const images = req.files.map((e) => e.path);
      const advertisement = await AdModule.create({
        shortText,
        description,
        images,
        user,
      });
      await advertisement.save();
      res.json({
        data: [
          {
            id: advertisement._id,
            shortText: advertisement.shortText,
            description: advertisement.description,
            images: advertisement.images,
            user: {
              id: advertisement.user._id,
              name: advertisement.user.name,
            },
            createdAt: advertisement.createdAt,
          },
        ],
        status: 'ok',
      });
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

app.delete('/:id', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  const authorizedUserId = req.user._id;
  const ad = await Advertisement.findById(id).select('-__v').populate('user');
  const adAuthorId = ad.user._id.toString();
  console.log(authorizedUserId, adAuthorId);
  try {
    if (authorizedUserId !== adAuthorId) {
      return res.status(403).json({
        error: 'вы не являетесь автором объявления',
        status: 403,
      });
    }
    AdModule.remove(id);
    return res.json({ message: 'объявление успешно удалено', status: 'ok' });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = app;
