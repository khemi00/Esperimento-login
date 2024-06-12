const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./public/init_db');

const app = express();
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Received login request:', username, password);

    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        } else if (row) {
            console.log('Login successful for user:', username);
            res.json({ success: true });
        } else {
            console.log('Invalid credentials for user:', username);
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
