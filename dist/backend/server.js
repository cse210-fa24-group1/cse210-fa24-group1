const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./database.db");

// Middleware
app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Users table is ready.");
        }
    });
});

app.get("/api/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


app.post("/api/users", (req, res) => {
    const { username, password, email } = req.body;
    const createdAt = new Date().toISOString();
    db.run(
        "INSERT INTO users (username, password, email, createdAt) VALUES (?, ?, ?, ?)",
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



app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});