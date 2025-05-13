const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 80;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve static files from /public

// Initialize DB
async function initialize() {
  let connected = false;
  let attempts = 0;

  while (!connected && attempts < 10) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `);
      console.log("Table ready");
      connected = true;
    } catch (err) {
      attempts++;
      console.log(`DB not ready yet. Retrying (${attempts}/10)...`);
      await new Promise(res => setTimeout(res, 2000)); // wait 2s
    }
  }

  if (!connected) {
    console.error("Failed to connect to DB after multiple attempts.");
    process.exit(1);
  }

  // Start the server only after DB is ready
  app.listen(port, () => {
    console.log(`CRUD app listening at http://localhost:${port}`);
  });
}

initialize();

// API Routes
// UPDATE
app.put('/items/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    await pool.query("UPDATE items SET name = ? WHERE id = ?", [name, id]);
    res.json({ id, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE
app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query("INSERT INTO items(name) VALUES(?)", [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/items/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    await pool.query("UPDATE items SET name = ? WHERE id = ?", [name, id]);
    res.json({ id, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM items WHERE id = ?", [id]);
    res.json({ message: `Item ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback to index.html for unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
