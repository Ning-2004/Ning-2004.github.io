const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
};

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>登入</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap" rel="stylesheet">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: 'Noto Sans TC', sans-serif; }
      </style>
    </head>
    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">登入</h1>
        <div action="/login" method="POST" class="space-y-4">
          <div>
            <label class="block text-gray-700">用戶名</label>
            <input type="text" name="username" class="w-full p-2 border rounded-md" required>
          </div>
          <div>
            <label class="block text-gray-700">密碼</label>
            <input type="password" name="password" class="w-full p-2 border rounded-md" required>
          </div>
          <button onclick="document.querySelector('form').submit()" class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">登入</button>
        </div>
      </body>
    </html>
  `);
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    req.session.authenticated = true;
    res.redirect('/youth-friendly-city');
  } else {
    res.send('無效的用戶名或密碼！<a href="/login">返回登入</a>');
  }
});

// Protected route for youth-friendly-city
app.get('/youth-friendly-city', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});