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
    const user = req.cookies.user;
    if (user) {
      const { votes } = post;
      const voter =
        votes.voters && votes.voters.find(v => v.userId === user._id);
      if (voter) return res.status(200).json({ post, initVote: voter.vote });
    }
    res.status(200).json({ post });
  });
});

router.post('/vote/:id', (req, res) => {
  const user = req.cookies.user;
  if (!user) return res.status(400).send('No "user"');

  const { id } = req.params;

  Post.findById(id, (err, post) => {
    if (err) return res.status(400).send(err);

    const { votes } = post;

    let prevVote = 0;
    let vote = req.body.vote;
    if (isNaN(vote))
      return res.status(400).send('"vote" value must be a number');

    const voter = votes.voters && votes.voters.find(v => v.userId === user._id);
    if (voter) {
      prevVote = voter.vote;
      voter.vote = vote;
    } else {
      votes.voters.push({ userId: user._id, vote });
    }

    if (vote === prevVote) return res.status(304).send(post);
    if (vote === 1) {
      votes.upvotes++;
      if (prevVote === -1) votes.downvotes--;
    } else if (vote === -1) {
      votes.downvotes++;
      if (prevVote === 1) votes.upvotes--;
    } else if (vote === 0) {
      if (prevVote === 1) votes.upvotes--;
      else if (prevVote === -1) votes.downvotes--;
    }

    try {
      post
        .save()
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      return res.status(400).send(err);
    }
  });
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
