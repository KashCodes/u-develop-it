// import express 
const express = require('express');

//designated port and app 
const PORT = process.env.PORT || 3001;
const app = express();

// connect SQLite3 database
const sqlite3 = require('sqlite3').verbose();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database specified election.db
const db = new sqlite3.Database('./db/election.db', err => {
  // if error display error message
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the election database.');
});

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection on specified port
db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});