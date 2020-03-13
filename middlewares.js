const User = require('./models/User');

function verifyUser(req, res, next) {
  if (!req.cookies.userId) return res.status(401).send('Not logged in');
  User.findById(req.cookies.userId, (err, user) => {
    if (err) return res.status(400).send(err);
    req.user = user;
    next();
  });
}

module.exports.verifyUser = verifyUser;
