const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./public/init_db');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        } else if (row) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
