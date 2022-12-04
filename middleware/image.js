const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = req.user._id;
    if (!fs.existsSync(`uploads/${dir}`)) {
      fs.mkdirSync(`uploads/${dir}`);
    }
    cb(null, `uploads/${dir}`);
  },
  filename(req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    );
    cb(null, `${file.originalname}`);
  },
});

module.exports = multer({ storage });
