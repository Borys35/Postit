const router = require('express').Router();
const Joi = require('@hapi/joi');
const Post = require('../models/Post');
const User = require('../models/User');
const Community = require('../models/Community');
const { verifyUser } = require('../middlewares');

const postSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(50)
    .required(),
  content: Joi.string()
    .min(10)
    .max(2500)
    .required(),
  community: Joi.string().required(),
  commentable: Joi.boolean().required(),
  author: Joi.required()
});

const commentSchema = Joi.object({
  content: Joi.string()
    .min(5)
    .max(200)
    .required(),
  author: Joi.required()
});

router.get('/', async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .exec();

  for (let i = 0; i < posts.length; i++) {
    posts[i].author = await User.findById(posts[i].author);
  }

  res.status(200).send(posts);
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.author = await User.findOne(post.author);
  post.community = await Community.findById(post.community);
  post.comments.sort((a, b) => b.createdAt - a.createdAt);
  delete post._doc.votes;
  res.status(200).send(post);
});

router.get('/get/votes/:id', async (req, res) => {
  const { votes } = await Post.findById(req.params.id);
  let total = votes.length;
  let totalUps = votes.filter(({ vote }) => vote > 0).length;

  let userVote = 0;
  const { userId } = req.cookies;
  if (userId) {
    const voter = votes.find(v => v.user.toString() === userId);
    if (voter) {
      userVote = voter.vote;
      total -= 1;
      if (userVote > 0) totalUps -= 1;
    }
  }

  res.status(200).send({ votes: { total, totalUps }, userVote });
});

router.patch('/vote/:id', verifyUser, async (req, res) => {
  const { user } = req;
  const { vote } = req.body;

  const post = await Post.findById(req.params.id);

  const voter = post.votes.find(v => v.user.toString() === user.id);
  if (vote === 0) {
    // DELETING USER FROM 'VOTES'
    post.votes.pull(voter.id);
  } else {
    // UPDATING 'VOTE' VALUE
    if (voter) voter.vote = vote;
    else post.votes.push({ user, vote });
  }

  try {
    const result = await post.save();
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/add-comment/:id', verifyUser, (req, res) => {
  const { user } = req;

  const commentDoc = {
    content: req.body.content,
    author: user.username
  };

  const { error } = commentSchema.validate(commentDoc);
  if (error) return res.status(400).send(error);

  Post.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: commentDoc } },
    (err, post) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(post);
    }
  );
});

router.post('/create', verifyUser, async (req, res) => {
  const { user } = req;

  const postDoc = {
    title: req.body.title,
    content: req.body.content,
    community: req.body.community,
    commentable: req.body.commentable,
    author: user
  };

  const { error } = postSchema.validate(postDoc);
  if (error) return res.status(400).send(error.details[0].message);

  const post = new Post(postDoc);
  const savedPost = await post.save();
  await User.updateOne({ _id: user._id }, { $push: { posts: savedPost } });
  await Community.updateOne(
    { id: postDoc.communityId },
    { $push: { posts: savedPost } }
  );
  res.status(200).send(savedPost);
});

router.delete('/delete/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id }, (err, post) => {
    if (err) res.status(400).send(err);
    res.status(200).send(post);
  });
});

module.exports = router;
