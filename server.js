// import express 
const express = require('express');

//designated port and app 
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
});

//listen/connect for server call to specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});