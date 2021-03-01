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

// // allows you to be able to run SQLite commands. db.all() method runs the SQL query and executes the callback with all the resulting rows that match the query.(err or rows) Returning an array of objects. 
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//   console.log(rows);
// });

// // GET a single candidate - Will eventually replace hardcorded ID with variable based on clients req
// db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//   if(err) {
//     console.log(err);
//   }
//   console.log(row);
// });

/*  The method run() will execute an SQL query but won't retrieve any result data. - The question mark (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values at runtime. - An additional param argument can provide values for prepared statement placeholders. Here, we're hardcoding 1 temporarily to demonstrate how prepared statements work. If we need additional placeholders, the param argument can be an array that holds multiple values. -  An ES5 function is used for the callback. This allows us to take advantage of the database object that's returned in the callback function. Let's take a look at what the database object looks like, by logging this.  -  One reason to use a placeholder in the SQL query is to block an SQL injection attack, which replaces the client user variable and inserts alternate commands that could reveal or destroy the database. */

// // Delete a candidate - See above /*  */
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result, this, this.changes);
// });

// Create a candidate - In the SQL command we use the INSERT INTO command for the candidates table to add the values that are assigned to params.
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
//  The four placeholders must match the four values in params, so we must use an array.
const params = [1, 'Ronald', 'Firbank', 1];
// ES5 function, not arrow function, to use this
db.run(sql, params, function(err, result) {
  if (err) {
    console.log(err);
  }
  // In the response, we'll log the this.lastID to display the id of the added candidate.
  console.log(result, this.lastID);
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