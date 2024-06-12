const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const checkLogin = (username, password, callback) => {
  const db = new sqlite3.Database('init_db.js');
  db.get(`SELECT * FROM user WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      callback(err, null);
    } else {
      console.log('Database query result:', row);
      callback(null, row);
    }
  });
  db.close();
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt with username: ${username} and password: ${password}`); // Log the login attempt
  checkLogin(username, password, (err, user) => {
    if (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Errore del server' });
    } else if (user) {
      console.log('Login successful');
      res.status(200).json({ message: 'LOGIN EFFETTUATO' });
    } else {
      console.log('Login failed');
      res.status(401).json({ message: 'LOGIN FALLITO' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
