
const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3001;
const path = require('path');

const api = require('./routes/index.js')

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/api', api);

// get route for landing page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// get route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.listen(PORT, () =>
console.log(`Example app listening at http://localhost:${PORT}`)
);  