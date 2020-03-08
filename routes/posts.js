const router = require('express').Router();
const Joi = require('@hapi/joi');
const Post = require('../models/Post');

const postSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(50)
    .required(),
  content: Joi.string()
    .min(10)
    .max(500)
    .required(),
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

router.get('/', (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .exec((err, posts) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(posts);
    });
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(post);
  });
});

router.post('/vote/:id', (req, res) => {
  if (!req.body.value) return res.status(400).send('No given value');
  Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { upvotes: req.body.value } },
    (err, post) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(post);
    }
  );
});

router.post('/add-comment/:id', (req, res) => {
  const user = req.cookies.user;
  if (!user) return res.status(400).send('No "user"');

  const commentDoc = {
    content: req.body.content,
    author: user
  };

  const { error } = commentSchema.validate(commentDoc);
  if (error) return res.status(400).send(error);

  Post.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: commentDoc } },
    (err, post) => {
      if (err) res.status(400).send(err);
      res.status(200).send(post);
    }
  );
});

router.post('/create', (req, res) => {
  const user = req.cookies.user;
  if (!user) return res.status(400).send('No "user"');

  const postDoc = {
    title: req.body.title,
    content: req.body.content,
    commentable: req.body.commentable,
    author: user
  };

  const { error } = postSchema.validate(postDoc);
  if (error) return res.status(400).send(error);

  const post = new Post(postDoc);
  post
    .save()
    .then(value => res.status(200).send(value))
    .catch(err => res.status(400).send(err));
});

router.delete('/delete/:id', (req, res) => {
  Post.deleteOne({ _id: req.params.id }, (err, post) => {
    if (err) res.status(400).send(err);
    res.status(200).send(post);
  });
});

module.exports = router;
