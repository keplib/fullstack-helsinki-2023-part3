const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const phonebookModel = require('./models/phoneBookModel.js');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static('build'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));
app.use(express.json());
app.use(cors());

morgan.token('content', (request) =>
  request.method === 'POST' && request.body.name ? JSON.stringify(request.body) : null
);

// TODO error handling
app.get('/api/persons', async (req, res) => {
  const result = await phonebookModel.find({});
  res.json(result);
});

// TODO error handling
app.get('/info', async (req, res) => {
  const today = new Date();
  const persons = await phonebookModel.find({});
  res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${today.toString()}</p>`);
});

//works
app.get('/api/persons/:id', async (req, res) => {
  try {
    const result = await phonebookModel.findOne({ _id: req.params.id });
    result ? res.json(result) : res.status(404).end();
  } catch (e) {
    res.json(e);
  }
});

// works
app.delete('/api/persons/:id', async (req, res) => {
  try {
    const result = await phonebookModel.deleteOne({ _id: req.params.id });
    result ? res.json(result) : res.status(404).end();
  } catch (e) {
    res.json(e);
  }
});

// TODO error handling
app.get('*', function (req, res) {
  res.send('Page does not exist!', 404);
});

//TODO error handling
app.post('/api/persons', async (req, res) => {
  const incomingData = req.body;

  if (!incomingData.number || !incomingData.name) {
    return res.status(400).json({
      error: 'number or name is missing',
    });
  }

  const personToAdd = new phonebookModel({
    name: incomingData.name,
    number: incomingData.number,
  });

  const result = await personToAdd.save();
  res.json(result);
});

//TODO error handling
app.put('/api/persons/:id', async (req, res) => {
  const id = req.params.id;
  const incomingData = req.body;

  if (!incomingData.number || !incomingData.name) {
    return res.status(400).json({
      error: 'number or name is missing',
    });
  }
  const result = await phonebookModel.updateOne({ _id: id }, { number: incomingData.number });
  res.json(result);
});

// works
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
