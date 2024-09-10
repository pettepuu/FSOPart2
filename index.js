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

const mongoose = require('mongoose');

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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = Person.find(person => person.id === id)

    console.log(person)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = Person.filter(person => person.id !== id)
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'Name or number is missing. Try again' 
        });
      }

    const person = {
        id: Math.random()*1500 + 1,
        name: body.name,
        number: body.number,
      }

    const nameExists = Person.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ 
          error: 'Name must be unique' 
        });
    }
   
    console.log(body.name, body.number, body)
    person.save().then(result => {
      console.log(`Added contact to phonebook`);
      mongoose.connection.close();
    }).catch(err => {
      console.error('Error saving person:', err);
      mongoose.connection.close();
    });

  }) 

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })