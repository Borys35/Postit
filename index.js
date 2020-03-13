const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.set({
//     'Access-Control-Allow-Origin': 'http://localhost:3000',
//     'Access-Control-Allow-Headers':
//       'Origin, X-Requested-With, Content-Type, Accept',
//     'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
//     'Access-Control-Allow-Credentials': true
//   });
//   next();
// });

// Routes
const users = require('./routes/users');
const posts = require('./routes/posts');
const communities = require('./routes/communities');

// Use routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/communities', communities);

// Deployment condition
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Connecting to database
mongoose.connect(
  process.env.MONGODB_ATLAS_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log('Connected to database');
  }
);

// Running server app
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
