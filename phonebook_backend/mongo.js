const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-kd1ta.mongodb.net/phoneDB?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phone = mongoose.model('Phone', phoneSchema)

const phone = new Phone({
  name: process.argv[3],
  number: process.argv[4]
})

phone.save().then(response => {
  console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
})

Phone.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
})