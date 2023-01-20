
const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3001;
const path = require('path');
const uuid = require('./helpers/uuid')

// jsonNotes is a array variable that stores json data from db.json
const jsonNotes = require('./db/db.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// renders html notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// gets all notes from db.json file
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received to view notes`);

  // reads from db.json
  fs.readFile('./db/db.json', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      // sends the data back to user
      res.send(JSON.parse(data))
    }
  })
})

// posts new note to db.json
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to post a new note`);

  // destructure the req.body provided by user
  const { title, text } = req.body;

  // if both were provided, save into newNote variable
  if (title && text) {
    const newNote = {
      noteId: uuid(),
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

app.listen(PORT, () =>
console.log(`Example app listening at http://localhost:${PORT}`)
);  