let data = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Jessica Poppendieck",
    "number": "39-23-6423122"
  }
]

const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// app.use(requestLogger)
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'))


const generateId = () => {
  const id = Math.round(Math.random() * 1000000)
  return String(id)

}

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = data.find(item => item.id === id)
  person ? response.json(person) : response.status(404).end()
})

app.get('/api/info', (request, response) => {
  const html = `
  <p>Phonebook has info for ${data.length} ${data.length > 1 ? "people" : "person"}</p>
  <p>${new Date()}</p>
  `
  response.send(html)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  data = data.filter(item => item.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "name missing"
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: "number missing"
    })
  } else if (data.filter(item => item.name === body.name).length > 0) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  data = data.concat(person)
  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})