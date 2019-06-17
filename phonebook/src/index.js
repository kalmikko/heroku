import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import phoneService from './component/phonebook'
import './index.css'

const Filter = ({ filter, persons }) => {
    if(filter === '' || filter === undefined){
        
    }else{
        persons = persons.filter(row => 
            row.name.toLowerCase()
            .includes(filter.toLowerCase())
        )
    }
    return (
        <Rows persons={persons} />
    )
}

const Rows = ({ persons }) => {
    const rows = () => persons.map(row => 
        <Row 
            key={row.name}
            row={row}
        />
    )
    return (
        <div>{rows()}</div>
    )
}

const Row = ({ row }) => {
    const deletePerson = (event) => {
        event.preventDefault()
        if(window.confirm(`remove ${row.name}?`)){
            phoneService.remove(row.id)
            window.location.reload(true)
        }
    }
    return (
        <div>
            {row.name}, {row.number}
            <form onSubmit={deletePerson}>
                <button type='submit' >delete</button>
            </form>
        </div>
    )
}

const Notification = ({ message} ) => {
    if (message == null){
        return null
    }
    return (
        <div className="message">
            {message}
        </div>
    )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ filter, setFilter] = useState('')
  const [ addedMessage, setMessage] = useState(null)

  const handleName = (event) => {
      setNewName(event.target.value)
  }
  const handleNumber = (event) => {
      setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
      setFilter(event.target.value)
  }
  const addPerson = (event) => {
      event.preventDefault()
      const len = persons.length
      const nameObject = {
          id: len + 1,
          name: newName, 
          number: newNumber}
      var i 
      var new_id
      var nameFound = 0
      for(i=0;i<len;i++){
        if(nameObject.name.toLowerCase() === persons[i].name.toLowerCase()){
            nameFound = 1
            new_id = i
        }
      }
      if(nameFound === 0){
          console.log(nameObject)
        phoneService.create(nameObject)
            .then(data => {
                setPersons(persons.concat(data))
                setNewName('')
                setMessage(`${newName} added`)
                setTimeout(() => {setMessage(null)},2000)
            }).catch(error => {
                    console.log(error.response.data)
                }
            )
      }else{
          if(window.confirm(`${newName} is already in phonebook, replace old number with new?`)){
            const newObject = {
                id: new_id,
                name: newName, 
                number: newNumber}
            phoneService.update(new_id, newObject)
            .then(returnData => {
                setPersons([])
                phoneService.getAll()
                    .then(data => {
                        if(data.id!==new_id){
                            setPersons(persons.concat(data))
                        }else{
                            setPersons(persons.concat(newObject))
                        }
                    })
            })
          }
      }
  }

  useEffect(() => {
    phoneService.getAll()
        .then(data => {        
            setPersons(data)      
        })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
        <div>
            <Notification message={addedMessage} />
            filter shown with: <input 
                value={filter}
                onChange={handleFilter}
            />
            <h2>add a new</h2>
          <form onSubmit={addPerson}>
            name: <input
                value={newName}
                onChange={handleName}
            />
            <br />
            number: <input 
                value={newNumber}
                onChange={handleNumber}
            /> 
            <br />
            <button type="submit">save</button>
          </form>
        </div>
      <h2>Numbers</h2>
      <Filter persons = {persons} filter={filter}/>
    </div>
  )
}

const refresh = () => {
    ReactDOM.render(<App />, document.getElementById('root'))
}

refresh()

export default App