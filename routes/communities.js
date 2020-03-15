const router = require('express').Router();
const Community = require('../models/Community');
const Post = require('../models/Post');
const User = require('../models/User');
const { verifyUser } = require('../middlewares');

router.get('/', (req, res) => {
  Community.find((err, comms) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(comms);
  });
});

router.get('/:id', (req, res) => {
  Community.findById(req.params.id, (err, comm) => {
    if (err) return res.status(400).send(err);
    Post.find({ _id: { $in: comm.posts } }, (err, posts) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ comm, posts });
    });
  });
});

router.get('/get-by-name/:name', async (req, res) => {
  const community = await Community.findOne({ name: req.params.name });
  const posts = await Post.find({ _id: { $in: community.posts } })
    .sort({ createdAt: -1 })
    .exec();

  for (let i = 0; i < posts.length; i++) {
    posts[i].author = await User.findById(posts[i].author);
  }

  res.status(200).json({ community, posts });
});

router.patch('/join/:id', verifyUser, async (req, res) => {
  const { user } = req;

  const community = await Community.findById(req.params.id);
  if (!user.communities.some(c => c.toString() === community.id)) {
    community.users.push(user.id);
    try {
      await User.updateOne(
        { _id: user._id },
        { $push: { communities: { _id: community._id } } }
      );
      await community.save();
      res.status(200).send('Joined now');
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('Already joined');
  }
});

router.patch('/leave/:id', verifyUser, async (req, res) => {
  const { user } = req;

  const community = await Community.findById(req.params.id);
  if (user.communities.some(c => c.toString() === community.id)) {
    community.users.pull(user.id);
    try {
      await User.updateOne(
        { _id: user._id },
        { $pull: { communities: community._id } }
      );
      await community.save();
      res.status(200).send('Left now');
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('Already left');
  }
});

module.exports = router;
