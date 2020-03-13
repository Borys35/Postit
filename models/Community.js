const mongoose = require('mongoose');

const communitySchema = mongoose.Schema({
  name: String,
  description: String,
  users: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ],
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

module.exports = mongoose.model('Community', communitySchema);
