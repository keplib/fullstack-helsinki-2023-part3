const express = require('express');
const persons = require('./db.js');
const PORT = 3001;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/persons', (req, res) => {
  res.send(persons);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
