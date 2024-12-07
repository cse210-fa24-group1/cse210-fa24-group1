const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./database.db");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create tables if they don't exist
db.serialize(() => {

    // Create 'users' table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            userid INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error("Error creating 'users' table:", err.message);
        else console.log("'users' table is ready.");
    });

    // Create 'transactions' table
    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            transactionid INTEGER PRIMARY KEY AUTOINCREMENT,
            isExpense BOOLEAN NOT NULL,
            amount INTEGER NOT NULL,
            categoryid INTEGER NOT NULL,
            description TEXT,
            timestamp TEXT NOT NULL
        )
    `, (err) => {
        if (err) console.error("Error creating 'transactions' table:", err.message);
        else console.log("'transactions' table is ready.");
    });


    // Create 'user_transaction_mapping' table
    db.run(`
        CREATE TABLE IF NOT EXISTS user_transaction_mapping (
            userid INTEGER NOT NULL,
            transactionid INTEGER NOT NULL,
            FOREIGN KEY(userid) REFERENCES users(userid),
            FOREIGN KEY(transactionid) REFERENCES transactions(transactionid)
        )
    `, (err) => {
        if (err) console.error("Error creating 'user_transaction_mapping' table:", err.message);
        else console.log("'user_transaction_mapping' table is ready.");
    });

});

// API to get all users
app.get("/api/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


// API to create a new user
app.post("/api/users", (req, res) => {
    const { username, password, email } = req.body;
    const timestamp = new Date().toISOString();

    db.run(
        `INSERT INTO users (username, password, email, timestamp) VALUES (?, ?, ?, ?)`,
        [username, password, email, timestamp],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ userid: this.lastID, username, email, timestamp });
        }
    );
});

// API to create a new transaction for a user
app.post("/api/transactions", (req, res) => {
    const { userid, isExpense, amount, categoryid, description } = req.body;

    const timestamp = new Date().toISOString();

    // Insert into 'transactions' table
    db.run(
        `INSERT INTO transactions (isExpense, amount, categoryid, description, timestamp) VALUES (?, ?, ?, ?, ?)`,
        [isExpense, amount, categoryid, description, timestamp],
        function (err) {
            if (err) {
                console.log("Error inserting transaction:", err.message); // Debugging
                res.status(500).json({ error: err.message });
                return;
            }

            // Get the transaction ID and update the mapping table
            const transactionid = this.lastID;

            db.run(
                `INSERT INTO user_transaction_mapping (userid, transactionid) VALUES (?, ?)`,
                [userid, transactionid],
                function (err) {
                    if (err) {
                        console.log("Error updating user-transaction mapping:", err.message); // Debugging
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({
                        transactionid,
                        userid,
                        isExpense,
                        amount,
                        categoryid,
                        description,
                        timestamp
                    });
                }
            );
        }
    );
});


// API to get all transactions for a user
app.get("/api/transactions/:userId", (req, res) => {
    const { userId } = req.params;

    db.all(
        `
        SELECT t.transactionid, t.isExpense, t.amount, t.categoryid, t.description, t.timestamp
        FROM transactions t
        INNER JOIN user_transaction_mapping utm ON t.transactionid = utm.transactionid
        WHERE utm.userid = ?
        `,
        [userId],
        (err, rows) => {
            if (err) {
                console.log(err.message)
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});

// API to delete a transaction
app.delete("/api/transactions/:transactionid", (req, res) => {
    const { transactionid } = req.params;

    // Delete the transaction from the transactions table
    db.run(
        `DELETE FROM transactions WHERE transactionid = ?`,
        [transactionid],
        function (err) {
            if (err) {
                console.error("Error deleting transaction:", err.message);
                res.status(500).json({ error: err.message });
                return;
            }

            if (this.changes === 0) {
                res.status(404).json({ error: "Transaction not found" });
                return;
            }

            console.log(`Deleted transaction with ID: ${transactionid}`);

            // Delete the corresponding entry from the user_transaction_mapping table
            db.run(
                `DELETE FROM user_transaction_mapping WHERE transactionid = ?`,
                [transactionid],
                function (err) {
                    if (err) {
                        console.error("Error deleting user-transaction mapping:", err.message);
                        res.status(500).json({ error: err.message });
                        return;
                    }

                    console.log(`Deleted mapping for transaction ID: ${transactionid}`);
                    res.json({ message: `Transaction with ID ${transactionid} deleted successfully` });
                }
            );
        }
    );
});



app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});