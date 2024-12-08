const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
  db.run(
    `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            resetTokenId TEXT NULL
        )
    `,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Users table is ready.');
      }
    }
  );
  db.run(
    `
        CREATE TABLE IF NOT EXISTS resetTokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL,
            expiresAt TEXT NOT NULL
        )
    `,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('resetTokens table is ready.');
      }
    }
  );
});

app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/users', (req, res) => {
  const { username, password, email } = req.body;
  const createdAt = new Date().toISOString();
  db.run(
    'INSERT INTO users (username, password, email, createdAt) VALUES (?, ?, ?, ?)',
    [username, password, email, createdAt],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, username, email });
    }
  );
});

app.get('/api/resettoken', (req, res) => {
  console.log('GET');
  const { token } = req.query;

  db.all('SELECT * FROM resetTokens where token = ?', [token], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/resettoken', (req, res) => {
  console.log('POST');
  const { token, expiresAt } = req.body;
  db.run(
    'INSERT INTO resetTokens (token, expiresAt) VALUES (?, ?)',
    [token, expiresAt],
    function (err) {
      if (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log('Good');
      res.json({ id: this.lastID, token, expiresAt });
    }
  );
});

app.put('/api/users', (req, res) => {
  const { id, tokenid } = req.body;
  console.log('meow');
  db.run(
    'UPDATE users SET resetTokenId = ? WHERE id = ?;',
    [tokenid, id],
    function (err) {
      if (err) {
        console.error('Update error:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, id, tokenid });
    }
  );
});

app.put('/api/password', (req, res) => {
  const { id, password } = req.body;
  db.run(
    'UPDATE users SET password = ? WHERE id = ?;',
    [password, id],
    function (err) {
      if (err) {
        console.error('Update error:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, id, password });
    }
  );
});

// In your server-side route handler
app.get('/api/verify-reset-token', (req, res) => {
  console.log('Hi');
  const { token } = req.body;
  console.log(token);
  // First, check the reset token in the resetTokens table
  db.get(
    `SELECT * FROM resetTokens 
         WHERE token = ? AND datetime(expiresAt) > datetime('now')`,
    [token],
    (err, tokenRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!tokenRow) {
        return res.status(400).json({
          valid: false,
          message: 'Invalid or expired reset token',
        });
      }

      // If token is valid, find the associated user
      db.get(
        `SELECT * FROM users 
                 WHERE resetTokenId = ?`,
        [tokenRow.id],
        (err, user) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (!user) {
            return res.status(400).json({
              valid: false,
              message: 'No user associated with this token',
            });
          }

          // Token is valid and user is found
          res.json({
            valid: true,
            username: user.username,
            email: user.email,
          });
        }
      );
    }
  );
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
