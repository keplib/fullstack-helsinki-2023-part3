const express = require('express');
const persons = require('./db.js');
const PORT = 3001;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  res.write(`Phonebook has info for ${persons.length} people.`);
  res.write(`${Date.now()}`);
  res.end();
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
