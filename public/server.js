const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 5500;

// In-memory users for demonstration (you can replace this with a database later)
let users = {
    'john': { password: '12345', level: 1, loginCount: 0 },
    'jane': { password: 'password', level: 2, loginCount: 0 }
};

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files (CSS, JS, HTML files)
app.use(express.static(path.join(__dirname, 'public')));

// POST route for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists and password is correct
    if (users[username] && users[username].password === password) {
        // Increment level and login count for every successful login
        users[username].level += 1;        // Increment level by 1
        users[username].loginCount += 1;    // Increment login count

        // Send success response with updated level and login count
        res.json({
            success: true,
            level: users[username].level,
            username,
            loginCount: users[username].loginCount
        });
    } else {
        res.json({ success: false });
    }
});

// Game route to render the game page with username, level, and login count
app.get('/game', (req, res) => {
    const { username, level, loginCount } = req.query;

    if (username && level) {
        // Send HTML for game page with username, level, and login count
        res.send(`
            <html>
                <head>
                    <link rel="stylesheet" href="/_css/normalize.css">
                    <link rel="stylesheet" href="/_css/styles.css">
                    <script src="/_js/script.js"></script> <!-- Link to game script -->
                </head>
                <body>
                    <h1>Welcome ${username}!</h1>
                    <p>Your current T Level: ${level}</p>
                    <p>Login Count: ${loginCount}</p>
                    <div id="gameContainer">
                        <!-- Game content goes here -->
                    </div>
                </body>
            </html>
        `);
    } else {
        res.redirect('/login.html');  // Redirect to login page if no valid user data
    }
});

// Route to serve the login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to serve the index page (or the main game page)
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
