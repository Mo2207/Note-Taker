
const express = require('express');
const app = express();

// use code from notes.js
const routeNotes = require('./notes.js');

// use routeNotes at "/notes" endpoint
app.use('/notes', routeNotes);

module.exports = app;