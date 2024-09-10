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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (req, res) => {
    const currentTime = new Date();
    const responseText = `
        <p>Phonebook has info for ${Person.countDocuments()} people</p>
        <p>${currentTime}</p>
    `;
    res.send(responseText);
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', async (request, response) => {
    try {
      await Person.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } catch (error) {
      response.status(400).json({ error: 'Malformed ID' });
    }
  });

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
      name: body.name,
      number: body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(updatePerson => {
        response.json(updatePerson)
      })
      .catch(error => next(error))
  })


app.post('/api/persons', async (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'Name or number is missing' 
        });
    }

    const person = new Person({
        id: Math.random()*1500 + 1,
        name: body.name,
        number: body.number,
    });

    try {
      person.save()
      .then(savedPerson => {
        response.json(savedPerson)
      })
    } catch (error) {
        console.error('Error saving person:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});
  

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })