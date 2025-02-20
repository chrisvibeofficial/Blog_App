const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  images: [{
    imageUrl: { type: String },
    publicId: { type: String }
  }],
  user: {
    type: String,
    require: true
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users'
  },
  commentId: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'comments'
  }]
}, { timestamps: true });

const userModel = mongoose.model('posts', postSchema);

module.exports = userModel;