const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve il file HTML per le richieste GET alla radice
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const checkLogin = (username, password, callback) => {
  console.log('Connecting to database...');
  const db = new sqlite3.Database('users.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Could not connect to database', err);
      callback(err, null);
    } else {
      console.log('Connected to database');
      db.get(`SELECT * FROM user WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) {
          console.error('Error querying database', err);
          callback(err, null);
        } else {
          console.log('Query result:', row);
          callback(null, row);
        }
        db.close((err) => {
          if (err) {
            console.error('Error closing database connection', err);
          } else {
            console.log('Database connection closed');
          }
        });
      });
    }
  });
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
