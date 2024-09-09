const express = require('express');
var morgan = require('morgan')
const app = express();
const cors = require('cors')

app.use(cors())

morgan.token('body', (req) => {return JSON.stringify(req.body);});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(express.json())

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
    const currentTime = new Date();
    const responseText = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime}</p>
    `;
    res.send(responseText);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    console.log(person)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
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

    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ 
          error: 'Name must be unique' 
        });
    }
   
    console.log(body.name, body.number, body)
    persons = persons.concat(person)
    response.json(person)

  }) 

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })