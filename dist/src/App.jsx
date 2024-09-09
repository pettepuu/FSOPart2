import { useState, useEffect } from 'react'
import personService from './personService'
import ShownPersons from './ShownPersons'
import PhoneBook from './Phonebook'
import PersonForm from './PersonForm'
import Notification from './Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredPersons, setFilteredPersons] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
      .then(availablePersons => {
        console.log('promise fulfilled')
        setPersons(availablePersons.data)
      })
  }
  useEffect(hook, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilteredPersons(event.target.value)
  }
  const handleRemovePerson = (id) => {
    personService
    .remove(id)
    .then(() => {
      setPersons(persons.filter(person => person.id !== id))
      setSuccessMessage(
        `Person has been removed`
      )
    })
    .catch(error => {
      setErrorMessage(
        `Person was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    });
  }

  const personsToShow = filteredPersons
  ? persons.filter(person => person.name.toLowerCase().includes(filteredPersons.toLowerCase()))
  : persons

  const existingPerson = persons.find(person => person.name === newName);

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = { name: newName, number: newNumber }
    if (existingPerson) {
      if (window.confirm(`${newName} is already in use, want to replace it with new number?`))
      personService
      .update(existingPerson.id, personObject)
      .then(response => {
        setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
        setNewName('')
        setNewNumber('')
        setSuccessMessage(
          `Persons data has been updated`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    }
    else{
      personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(
          `Person is added to phonebook`
        )
        console.log(successMessage)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
    })}
  }

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      <PhoneBook 
      filteredPersons={filteredPersons} 
      handleFilterChange={handleFilterChange} />
      <h2>add new person</h2>
      <PersonForm 
        addName={addName} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      {personsToShow.map(person =>
        <ShownPersons 
        key={person.id} 
        name={person.name} 
        number={person.number}
        handleRemovePerson={() => handleRemovePerson(person.id)}/>
        )
        }
    </div>
  )

}

export default App
