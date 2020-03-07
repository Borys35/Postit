const router = require('express').Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const User = require('../models/User');

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

router.get('/verify', (req, res) => {
  const user = req.cookies.user;
  if (!user) return res.status(401).send('Not logged in');
  res.status(200).send(user);
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
              res.cookie('user', user, {
                httpOnly: true,
                maxAge: 1000 * 60 * 15
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
        res.cookie('user', user, {
          httpOnly: true,
          maxAge: 1000 * 60 * 15
        });
        res.status(200).send(user);
      } else {
        res.status(400).send('Invalid "password"');
      }
    });
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.status(200).send('Logged out');
});

module.exports = router;
