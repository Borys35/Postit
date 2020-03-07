const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  commentable: Boolean,
  author: {
    username: String,
    id: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  },
  comments: [
    {
      content: String,
      author: {
        username: String,
        id: {
          type: mongoose.Types.ObjectId,
          ref: 'User'
        }
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
