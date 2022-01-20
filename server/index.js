const express = require('express');
const path = require('path');
const routes = require('./routes.js');

var app = express();

app.get('/reviews', routes.getReviews);
app.get('/reviews/meta', routes.getMetaData)
app.post('/reviews', routes.post);
app.put('/reviews/*', (req, res) => {
  if (req.url.includes('helpful')) {
    routes.helpful(req, res);
  } else {
    routes.report(req, res);
  }
});

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server listening on port 3000');
  }
});