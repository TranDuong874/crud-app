// 1. First, install EJS
// npm install ejs

// 2. Modify your server.js to use EJS
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Set EJS as the template engine

app.get('/', (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Error fetching users");
    }
    res.render('index', { users: results }); // Pass data to the template
  });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const { name, email } = req.body;
  db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err) => {
    if (err) {
      console.error("Error creating user:", err);
      return res.status(500).send("Error creating user");
    }
    res.redirect('/');
  });
});

app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      console.error("Error finding user:", err);
      return res.status(404).send("User not found");
    }
    res.render('edit', { user: results[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  const { name, email } = req.body;
  db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id], (err) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Error updating user");
    }
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).send("Error deleting user");
    }
    res.redirect('/');
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));