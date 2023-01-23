
const express = require('express');
const app = express();

const routeNotes = require('./notes.js');

app.use('/notes', routeNotes);

module.exports = app;