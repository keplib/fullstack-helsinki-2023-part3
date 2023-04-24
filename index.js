const express = require('express');
const persons = require('./db.js');
const PORT = 3001;

const app = express();

const today = new Date();

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${today.toString()}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === Number(id));
  person ? res.json(person) : res.send('<p>Entry not found</p>');
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
