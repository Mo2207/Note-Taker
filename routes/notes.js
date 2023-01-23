
const notes = require('express').Router();
const fs = require('fs');
const uuid = require('../helpers/uuid');

// get notes data
notes.get('/', (req, res) => {
  console.info(`${req.method} request received to view notes`);

  fs.readFile('./db/db.json', (err, data) => {
    if (err) console.log(err);
    else res.send(JSON.parse(data));
  })
})

// jsonNotes stores the json data from db.json
let jsonNotes = require('../db/db.json');

// post new note to db.json/
notes.post('/', (req, res) => {
  console.info(`${req.method} request received to post a new note`);

  // destructure the req.body provided by user
  const { title, text } = req.body;

  // if both were provided, save into newNote variable
  if (title && text) {
    const newNote = {
      id: uuid(),
      title,
      text
    }

    // push the newNote into jsonNotes array
    jsonNotes.push(newNote);

    // overwrite the file with the newNote that was just pushed to the array
    fs.writeFile(`./db/db.json`, JSON.stringify(jsonNotes), (err) =>
    err
      ? console.error(err)
      : console.log('Note added!')
    )
    // send updated jsonNotes back to the user
    res.status(201).send(jsonNotes)
  } else {
    // otherwise send error message
    res.status(500).send('Error adding note')
  }  
})

// delete a note with the given id
notes.delete('/:id', (req, res) => {
  console.info(`${req.method} request received to delete note with id of ${req.params.id}`);

  const targetedNote = req.params.id;
  fs.readFile('./db/db.json', (err, data) => {
    console.log(JSON.parse(data))
    if (err) {
      console.error(err)
    } else {
      var jsonNotes = data.filter((note) => note.noteId != targetedNote)
    }
  })

  fs.writeFile('./db/db.json', JSON.stringify(jsonNotes), (err) =>
    err
      ? console.error(err)
      : res.send(`Note with id: ${req.params.id} has been deleted.`)
  )
  // console.log(jsonNotes)

})

module.exports = notes;