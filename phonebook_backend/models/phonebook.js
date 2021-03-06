const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {    
      console.log('connected to MongoDB')  
    })  
    .catch((error) => {    
        console.log('error connecting to MongoDB:', error.message)  
    })

const phoneSchema = new mongoose.Schema({
    name: {type: String, unique: true, minlength:3, required: true},
    number: {type: String, required:true}
})

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

phoneSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Phone', phoneSchema)