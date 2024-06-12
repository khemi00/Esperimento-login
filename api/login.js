const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Use in-memory database for simplicity

const initializeDb = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )`);

    db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['admin', 'password']);
    db.run(`INSERT INTO user (username, password) VALUES (?, ?)`, ['user', 'pass123']);
  });
};

initializeDb();

const checkLogin = (username, password, callback) => {
  db.get(`SELECT * FROM user WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

export default (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    checkLogin(username, password, (err, user) => {
      if (err) {
        res.status(500).json({ message: 'Errore del server' });
      } else if (user) {
        res.status(200).json({ message: 'LOGIN EFFETTUATO' });
      } else {
        res.status(401).json({ message: 'LOGIN FALLITO' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
