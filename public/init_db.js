const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run("CREATE TABLE users (id INT, username TEXT, password TEXT)");

  const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)");
  stmt.run(1, 'user1', 'password1');
  stmt.run(2, 'user2', 'password2');
   stmt.run(2, 'ad', 'pw');
  stmt.finalize();
});

module.exports = db;
