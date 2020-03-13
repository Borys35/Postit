const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Community = require('../models/Community');
const { verifyUser } = require('../middlewares');

const userSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(20)
    .alphanum()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .alphanum()
    .required()
});

router.get('/verify', verifyUser, (req, res) => {
  const { user } = req;
  res.status(200).send({ id: user.id, username: user.username });
});

router.get('/get/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(user);
  });
});

router.get('/get-by-name/:name', (req, res) => {
  User.findOne({ username: req.params.name }, (err, user) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(user);
  });
});

router.get('/communities', verifyUser, (req, res) => {
  const { user } = req;
  res.status(200).send(user.communities);
});

router.get('/communities/:id', verifyUser, (req, res) => {
  const { user } = req;

  const community = user.communities.find(
    c => c.id.toString() === req.params.id
  );
  res.status(200).send(community);
});

router.patch('/communities/join/:id', verifyUser, (req, res) => {
  const { user } = req;

  Community.findByIdAndUpdate(
    req.params.id,
    { $push: { users: user } },
    (req, community) => {
      if (!user.communities.some(c => c.id === community.id)) {
        try {
          user.communities.push({ name: community.name, id: community });
          User.updateOne({ _id: user._id }, user, (err, raw) => {
            res.status(200).send(raw);
          });
        } catch (err) {
          res.status(400).send(err);
        }
      } else {
        res.status(400).send('Already joined');
      }
    }
  );
});

router.patch('/communities/leave/:id', verifyUser, async (req, res) => {
  const { user } = req;

  const community = await Community.findById(req.params.id);
  if (user.communities.some(c => c.id.toString() === community.id)) {
    community.users.pull(user.id);
    try {
      await User.updateOne(
        { _id: user._id },
        // PROBLEM
        { $pull: { communities: { id: community.id } } }
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

router.post('/register', (req, res) => {
  const userDoc = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  User.findOne(
    { $or: [{ username: req.body.username }, { email: req.body.email }] },
    (err, user) => {
      if (err) return res.status(400).send(err);
      if (user) return res.status(400).send('User exists');

      const { error } = userSchema.validate(userDoc);
      if (error) return res.status(400).send(error.details[0].message);

      bcrypt.hash(userDoc.password, 10, (err, encrypted) => {
        if (err) return res.status(400).send(err);
        userDoc.password = encrypted;

        const user = new User(userDoc);
        try {
          user
            .save()
            .then(data => {
              res.cookie('userId', user._id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 4
              });
              res.status(200).send(data);
            })
            .catch(err => {
              throw err;
            });
        } catch (err) {
          return res.status(400).send(err);
        }
      });
    }
  );
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(400).send(err);
    if (!user) return res.status(400).send('Invalid "email"');
    bcrypt.compare(req.body.password, user.password, (err, same) => {
      if (err) return res.status(400).send(err);
      if (same) {
        res.cookie('userId', user._id, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 4
        });
        res.status(200).send(user);
      } else {
        res.status(400).send('Invalid "password"');
      }
    });
  });
});

router.post('/logout', verifyUser, (req, res) => {
  res.clearCookie('userId');
  res.status(200).send('Logged out');
});

module.exports = router;
