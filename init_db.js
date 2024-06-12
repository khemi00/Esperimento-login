const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);

  // Inserisci nuovi utenti qui
  db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['admin', 'password']);
  db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['user', 'pass123']);
  db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['new_user', 'new_pass']);
  db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['example_user', 'example_pass']);
});

db.close();
console.log("Database users.db initialized successfully.");
