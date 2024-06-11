const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['admin', 'password']);
  db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['user', 'pass123']);
});

db.close();
