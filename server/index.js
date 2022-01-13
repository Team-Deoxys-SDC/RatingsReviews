const express = require('express');
const path = require('path');
const routes = require('./routes.js');

var app = express();

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.get('/reviews', routes.get);
app.post('/api/groceries', routes.post);
app.put('/api/groceries', routes.put);
app.delete('/api/groceries', routes.delete);

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server listening on port 3000');
  }
});