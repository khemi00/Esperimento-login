document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Attempting login with', username, password);

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        if (data.success) {
            window.location.href = '/game';
        } else {
            const messageElement = document.createElement('div');
            messageElement.className = 'alert alert-danger mt-3';
            messageElement.innerText = 'Login failed: ' + data.message;
            document.getElementById('loginForm').appendChild(messageElement);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const messageElement = document.createElement('div');
        messageElement.className = 'alert alert-danger mt-3';
        messageElement.innerText = 'An error occurred. Please try again later.';
        document.getElementById('loginForm').appendChild(messageElement);
    });
});
