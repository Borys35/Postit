const router = require('express').Router();
const Community = require('../models/Community');
const Post = require('../models/Post');

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

module.exports = router;
