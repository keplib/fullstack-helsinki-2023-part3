const express = require('express');
let persons = require('./db.js');
const PORT = 3001;

const app = express();
app.use(express.json());

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
  person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === Number(id));
  if (person) {
    persons = persons.filter((person) => person.id !== Number(id));
    res.status(204).end();
  }
  res.status(404).end();
});

app.get('*', function (req, res) {
  res.send('Page does not exist!', 404);
});

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;
  const maxId = Math.max(...persons.map((n) => n.id));
  persons = persons.concat({ ...newPerson, id: maxId + 1 });
  res.json(persons);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
