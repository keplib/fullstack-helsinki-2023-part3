const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const phobebookModel = require('./models/phoneBookModel.js');

let persons = require('./db.js');
const phoneBookModel = require('./models/phoneBookModel.js');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));
app.use(express.json());
app.use(cors());

morgan.token('content', (request) =>
  request.method === 'POST' && request.body.name ? JSON.stringify(request.body) : null
);

const today = new Date();

app.get('/api/persons', (req, res) => {
  phobebookModel.find({}).then((result) => {
    res.json(result);
  });
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${today.toString()}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  phobebookModel.findOne({ _id: id }).then((result) => {
    res.json(result);
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  phoneBookModel.deleteOne({ _id: id }).then((result) => {
    res.json(result);
  });
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

  const personToAdd = new phoneBookModel({
    name: incomingData.name,
    number: incomingData.number,
  });

  personToAdd.save().then((result) => {
    res.json(result);
  });
});

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const incomingData = req.body;

  if (!incomingData.number || !incomingData.name) {
    return res.status(400).json({
      error: 'number or name is missing',
    });
  }
  phoneBookModel.updateOne({ _id: id }, { number: incomingData.number }).then((result) => {
    res.send('worked!');
  });
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
