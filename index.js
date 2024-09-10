require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json());

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => next(error));
});

app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments();
    const currentTime = new Date();
    const responseText = `
      <p>Phonebook has info for ${count} people</p>
      <p>${currentTime}</p>
    `;
    res.send(responseText);
  } catch (error) {
    next(error);
  }
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error));
});

app.post('/api/persons', async (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});


const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'Validation Error' });
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).send({ error: 'Duplicate key error' });
  }
  
  response.status(500).send({ error: 'Internal Server Error' });
};

// Apply error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});