
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

  // targetedNote is the id of the note to be deleted
  const targetedNote = req.params.id;

  // read the contents of db.json file
  function readFromFile() {
    fs.readFile('./db/db.json', (err, data) => {
      data = JSON.parse(data);
      if (err) {
        console.error(err)
      } else {
        jsonNotes = data.filter((note) => note.id !== targetedNote)
        // console.log('jsonNotes after deletion:');
        // console.log(jsonNotes)
        return jsonNotes;
      }
    })
  }
  
  // rewrite the contents of db.json file without the targetedNote
  function reWriteFile() {
    // console.log('jsonNotes before re-write:');
    // console.log(jsonNotes)
    fs.writeFile('./db/db.json', JSON.stringify(jsonNotes), (err) => {
      err
        ? console.error(err)
        : res.send(`Note with id: ${targetedNote} has been deleted.`)
    })
  }

  // first read from the db.json file
  readFromFile();
  // after the file has been read and the targetedNote has been removed, rewrite the file
  setTimeout(reWriteFile, 10)
})

module.exports = notes;