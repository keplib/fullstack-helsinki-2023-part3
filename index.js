const express = require('express');
const morgan = require('morgan');
let persons = require('./db.js');
const PORT = 3001;

const app = express();
app.use(morgan('tiny'));
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
  const incomingData = req.body;

  if (!incomingData.number || !incomingData.name) {
    return res.status(400).json({
      error: 'number or name is missing',
    });
  }

  const filterNames = persons.filter((person) => person.name === incomingData.name);

  if (filterNames.length > 0) {
    return res.status(400).json({
      error: 'name already exists in phonebook',
    });
  }
  const maxId = Math.max(...persons.map((n) => n.id));
  persons = persons.concat({ ...incomingData, id: maxId + 1 });
  res.json(persons);
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
