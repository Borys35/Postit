const express = require('express');
const mongoose = require('mongoose');
const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// mongoose.connect('URI TO ADD', () => {
//   console.log('Connected to database');
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
