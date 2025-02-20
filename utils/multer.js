const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    const ranNum = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const ext = file.mimetype.split('/')[1];
    cb(null, `IMG_${ranNum}.${ext}`)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file format: Upload Image'))
  }
};

const limits = {
  limits: 1024 * 1024 * 10
};

const Upload = multer({ storage, fileFilter, limits });

module.exports = Upload