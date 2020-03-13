const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Post'
    }
  ],
  communities: [
    {
      name: String,
      id: {
        type: mongoose.Types.ObjectId,
        ref: 'Community'
      }
    }
  ],
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
