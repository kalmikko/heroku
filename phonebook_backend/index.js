//imported dependencies
const express = require('express')
const app = express()
var morgan = require('morgan')
morgan.token('content', function(req, res){
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
require('dotenv').config()
const Phone = require("./models/phonebook")
//imported dependencies ^


app.post('/api/persons', (req,res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ 
        error: 'content missing' 
        })
    }
    
    const person = new Phone ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    }).catch((error) => {console.log(error.message)})
})

//error handling
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
  
    next(error)
}
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
//error handling ^


app.get('/api/persons/:id', (request, response, next) => {
    Phone.findById(request.params.id).then(note => {
        if(note) {
            response.json(note.toJSON())
        } else {
            response.status(204).end()
        }
      }).catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phone.findByIdAndRemove(request.params.id)
      .then(result => {
        console.log("removed")
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Phone.find({}).then(notes => {
      response.json(notes)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number
    }
  
    Phone.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedNote => {
        response.json(updatedNote.toJSON())
      })
      .catch(error => next(error))
})

app.get('/info', (req, res) => {
    var datestamp = new Date()
    res.write(`<div>Phonebook has info for ${Phone.length} people</div>`)
    res.write(`<div>${JSON.stringify(datestamp)}</div>`)
    res.end()
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})