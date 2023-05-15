const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const phonebookModel = require('./models/phoneBookModel.js');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));
app.use(express.json());
app.use(express.static('build'));
app.use(cors());

morgan.token('content', (request) =>
  request.method === 'POST' && request.body.name ? JSON.stringify(request.body) : null
);

app.get('/api/persons', async (req, res, next) => {
  try {
    const result = await phonebookModel.find({});
    result ? res.json(result) : res.status(400).end();
  } catch (e) {
    next(e);
  }
});

app.get('/info', async (req, res, next) => {
  try {
    const persons = await phonebookModel.find({});
    const today = new Date();
    result
      ? res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${today.toString()}</p>`)
      : res.status(400).end();
  } catch (e) {
    next(e);
  }
});

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const result = await phonebookModel.findOne({ _id: req.params.id });
    result ? res.json(result) : res.status(400).end();
  } catch (e) {
    next(e);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const result = await phonebookModel.deleteOne({ _id: req.params.id });
    result ? res.json(result) : res.status(400).end();
  } catch (e) {
    next(e);
  }
});

app.post('/api/persons', async (req, res, next) => {
  const incomingData = req.body;

  if (!incomingData.number || !incomingData.name) {
    return res.json({
      error: 'number or name is missing',
    });
  }

  const personToAdd = new phonebookModel({
    name: incomingData.name,
    number: incomingData.number,
  });

  try {
    const result = await personToAdd.save();
    result ? res.json(result) : res.status(400).end();
  } catch (e) {
    next(e);
  }
});

app.put('/api/persons/:id', async (req, res, next) => {
  const id = req.params.id;
  const incomingData = req.body;

  if (!incomingData.number || !incomingData.name) {
    return res.json({
      error: 'number or name is missing',
    });
  }

  try {
    const result = await phonebookModel.updateOne(
      { _id: id },
      // { number: incomingData.number },
      {
        $set: {
          number: incomingData.number,
        },
      },
      { runValidators: true }
    );
    result ? res.json(result) : res.status(400).end();
  } catch (e) {
    next(e);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
