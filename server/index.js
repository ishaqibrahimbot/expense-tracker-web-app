const express = require("express");
const mysql = require("mysql");
const path = require('path');
const cors = require("cors");
const {GenerateJWT, ValidateJWT, DecodeJWT} = require("./tokenManager.js");

// Create MySQL connection

const db = mysql.createConnection(process.env.JAWSDB_URL ? process.env.JAWSDB_URL : {
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
app.use(express.urlencoded({extended: true}));
app.use(cors());

/// Take array of ids and return a string fit for SQL query

function stringifyIds(idsToBeDeleted) {
    let sqlString = "(";
    idsToBeDeleted.forEach(id => {
        sqlString = sqlString + id + ",";
    });
    sqlString = sqlString.slice(0, -1) + ")";
    return sqlString;
}


//////////////Handle Sign Ups and Logins///////////////

app.post("/register", (req, res) => {
    //Get the username and password details
    res.send({
        success: true,
    });
});


app.post("/login", (req, res) => {
    
    //If so, make claims with username and userID, generate JWT, and send it back
    res.send({
        token: 'test123'
    });
});



// Add expense entry

app.post("/expenses", (req, res) => {

    //Run the below code with a modified query that selects details for userID

    let expense = {
        ...req.body,
        amount: parseFloat(req.body.amount),
        userID: 1,
    };

    let sql = "INSERT INTO expenses SET ?";
    db.query(sql, expense, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(`Successfully added:\n${expense}`);
            res.send("Successfully added a new entry...");
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
            res.send(JSON.stringify(result));
        }
    });
});

// Delete Expense

app.delete("/expenses/:idString", (req, res) => {
    const idString = req.params.idString;
    const idsToBeDeleted = idString.split('+');
    const sqlIdString = stringifyIds(idsToBeDeleted);

    let sql = `DELETE FROM expenses WHERE id IN ${sqlIdString}`;
 
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log(result);
            res.send("Deleted the post...");
        }
    });
});

if (process.env.NODE_ENV === 'production') {
    /// Have node serve the files for our built React app
    app.use(express.static(path.resolve(__dirname, '../client/build')));

    /// All non-defined get requests will return our react app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
    });
}


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// const key = "$expenseappbyishaq";

// const claims = {
//     username: "ishaqibrahim",
//     userId: 1,
// };

// const header = {
//     alg: "HS512",
//     typ: "JWT",
// };

// Create DB

// app.get('/createdb', (req, res) => {
//     let sql = "CREATE DATABASE expensedb";
//     db.query(sql, (err, result) => {
//         if (err) {
//             throw err;
//         } else {
//             console.log(result);
//             res.send("Database created!");
//         }
//     });
// })

// Create Expenses Table

// app.get("/createexpensetable", (req, res) => {
//     let sql = "CREATE TABLE expenses(id int AUTO_INCREMENT, description VARCHAR(255), amount FLOAT, category VARCHAR(255), date VARCHAR(255), PRIMARY KEY (id))";
//     db.query(sql, (err, result) => {
//         if (err) {
//             throw err;
//         } else {
//             console.log(result);
//             res.send("Created expenses table!");
//         }
//     });
// });



// Get specific expense 

// app.get("/expenses/:id", (req, res) => {
//     const id = req.params.id;
//     let sql = `SELECT * FROM expenses WHERE id = ${id}`;
//     db.query(sql, (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(result);
//             res.send("Retrieved post with given id");
//         }
//     });
// });

// // Update Expense

// app.get("/updateexpense/:id", (req, res) => {
//     const id = req.params.id;
//     let newAmount = 160;
//     let sql = `UPDATE expenses SET amount = ${newAmount} WHERE id = ${id}`;
//     db.query(sql, (err, result) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(result);
//             res.send("Updated the expense...");
//         }
//     });
// });


