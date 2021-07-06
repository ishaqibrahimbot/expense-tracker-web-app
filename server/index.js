const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

// Create MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "expensedb"
});

// Connect to DB

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("My SQL connected!");
    }
});

//////////////////////////////

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));


// Create DB

app.get('/createdb', (req, res) => {
    let sql = "CREATE DATABASE expensedb";
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log(result);
            res.send("Database created!");
        }
    });
})

// Create Expenses Table

app.get("/createexpensetable", (req, res) => {
    let sql = "CREATE TABLE expenses(id int AUTO_INCREMENT, description VARCHAR(255), amount FLOAT, category VARCHAR(255), date VARCHAR(255), PRIMARY KEY (id))";
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log(result);
            res.send("Created expenses table!");
        }
    });
});

// Add expense info

app.get("/addexpense", (req, res) => {
    
    let today = new Date();

    let expense = {
        description: "sabzi",
        amount: 140.0,
        category: "groceries",
        date: today.toLocaleDateString()
    };

    let sql = "INSERT INTO expenses SET ?";
    db.query(sql, expense, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send("First expense added!");
        }
    });
});

// Get all expenses

app.get("/expenses", (req, res) => {
    let sql = "SELECT * FROM expenses";
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send("Successfully retrieved all expenses!");
        }
    });
});

// Get specific expense 

app.get("/expenses/:id", (req, res) => {
    const id = req.params.id;
    let sql = `SELECT * FROM expenses WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send("Retrieved post with given id");
        }
    });
});

// Update Expense

app.get("/updateexpense/:id", (req, res) => {
    const id = req.params.id;
    let newAmount = 160;
    let sql = `UPDATE expenses SET amount = ${newAmount} WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send("Updated the expense...");
        }
    });
});

// Delete Expense

app.get("/deleteexpense/:id", (req, res) => {
    const id = req.params.id;
    let sql = `DELETE FROM expenses WHERE id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send("Deleted the post...");
        }
    });
});

app.get("/api", (req, res) => {
    res.json({message: "Hello from server!"});
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});