import { useEffect, useState } from "react";
import phonebookService from "./services/phonebook";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((persons) => setPersons(persons));
  }, []);

  const filteredPersons = keyword
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(keyword.toLowerCase())
      )
    : persons;

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const match = persons.find((person) => person.name === newName);

    if (match) {
      const replace = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (replace) {
        const newPerson = { ...match, number: newNumber };

        phonebookService.update(match.id, newPerson).then((returnedPerson) => {
          setPersons(persons.map((p) => (p === match ? returnedPerson : p)));
          setNewName("");
          setNewNumber("");

          setMessage({
            type: "notification",
            content: `Updated ${newPerson.name}`,
          });
          setTimeout(() => setMessage(null), 5000);
        });
      }

      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    phonebookService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");

      setMessage({ type: "notification", content: `Added ${newPerson.name}` });
      setTimeout(() => setMessage(null), 5000);
    });
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (confirm(`delete ${person.name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setMessage({
            type: "notification",
            content: `Deleted ${person.name}`,
          });
          setTimeout(() => setMessage(null), 5000);
        })
        .catch(() => {
          setPersons(persons.filter((p) => p !== person));
          setMessage({
            type: "error",
            content: `${person.name} does not exist`,
          });
          setTimeout(() => setMessage(null), 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter keyword={keyword} onChange={handleKeywordChange} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={deletePerson} />
    </div>
  );
};

export default App;
