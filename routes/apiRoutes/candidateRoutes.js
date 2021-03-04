const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

//  Get all candidates - allows you to be able to run SQLite commands. The api in the URL signifies that this is an API endpoint.
router.get('/candidates', (req, res) => {
  // The SQL statement SELECT * FROM candidates is assigned to the sql variable. 
  const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;
  // Here we set the params assignment to an empty array because there are no placeholders in the SQL statement.
  const params = [];
  // db.all() method runs the SQL query and executes the callback with all the resulting rows that match the query.(err or rows) Returning an array of objects.
  db.all(sql, params, (err, rows) => {
    if (err) {
      // displays server 500 error if error
      res.status(500).json({ error: err.message });
      return;
    }

    // displays success message and JSON formatted object if succeessful
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// GET a single candidate - the endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database.
router.get('/candidate/:id', (req, res) => {
  // In the database call, we'll assign the captured value populated in the req.params object with the key id to params. The database call will then query the candidates table with this id and retrieve the row specified.
  const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`;
  // Because params can be accepted in the database call as an array, params is assigned as an array with a single element, req.params.id.
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    // 400 error will display if it doesn't meet params
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    // successful message will display plus queried row. 
    res.json({
      message: 'success',
      data: row
    });
  });
});

/*  The method run() will execute an SQL query but won't retrieve any result data. - The question mark (?) denotes a placeholder, making this a prepared statement. Prepared statements can have placeholders that can be filled in dynamically with real values at runtime. - An additional param argument can provide values for prepared statement placeholders. Here, we're hardcoding 1 temporarily to demonstrate how prepared statements work. If we need additional placeholders, the param argument can be an array that holds multiple values. -  An ES5 function is used for the callback. This allows us to take advantage of the database object that's returned in the callback function. Let's take a look at what the database object looks like, by logging this.  -  One reason to use a placeholder in the SQL query is to block an SQL injection attack, which replaces the client user variable and inserts alternate commands that could reveal or destroy the database. */

// Delete a candidate - See above /*  */
router.delete('/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({
      message: 'successfully deleted',
      // this will verify whether any rows were changed.
      changes: this.changes
    });
  });
});

// Create a candidate  - In the SQL command we use the INSERT INTO command for the candidates table to add the values that are assigned to params.
router.post('/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];
  // ES5 function, not arrow function, to use `this`
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: body,
      id: this.lastID
    });
  });
});

// update party id's in candidates 
router.put('/candidate/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  const sql = `UPDATE candidates SET party_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];

  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: req.body,
      changes: this.changes
    });
  });
});


module.exports = router;