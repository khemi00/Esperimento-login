document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.createElement('div');
        if (data.success) {
            messageElement.className = 'alert alert-success mt-3';
            messageElement.innerText = 'Login successful';
        } else {
            messageElement.className = 'alert alert-danger mt-3';
            messageElement.innerText = 'Login failed: ' + data.message;
        }
        document.getElementById('loginForm').appendChild(messageElement);
    })
    .catch(error => {
        console.error('Error:', error);
        const messageElement = document.createElement('div');
        messageElement.className = 'alert alert-danger mt-3';
        messageElement.innerText = 'An error occurred. Please try again later.';
        document.getElementById('loginForm').appendChild(messageElement);
    });
});
