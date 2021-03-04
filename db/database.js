// connect SQLite3 database
const sqlite3 = require('sqlite3').verbose();

// Connect to database specified election.db
const db = new sqlite3.Database('./db/election.db', err => {
  // if error display error message
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the election database.');
});





module.exports = db;