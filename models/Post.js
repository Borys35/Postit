const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  commentable: Boolean,
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  community: {
    type: mongoose.Types.ObjectId,
    ref: 'Community'
  },
  votes: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      },
      vote: Number
    }
  ],
  comments: [
    {
      content: String,
      author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
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
