require('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require("cors");
const bcrypt = require("bcrypt");
const {GenerateJWT, ValidateJWT, DecodeJWT} = require("./tokenManager.js");
const { stringifyIds, connectToMySQLDatabase, insertExpenseIntoDB, 
    retrieveAllExpenses, deleteExpenses, addUser, retrieveAllCategories,
    addCategoryToDB, deleteCategory } = require("./databaseService.js");


//////////////////////////////

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Connect to database
const db = connectToMySQLDatabase();

//Temporary setting
const userID = 1;

//Define key for JWT
const key = "oneKeyToRuleThemAll";

//////////////Handle Sign Ups and Logins///////////////

app.post("/register", (req, res) => {
    //Get the username and password details
    const { username, password } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (!err) {
            bcrypt.hash(password, salt, (err, hash) => {
                if(!err) {
                    addUser(res, db, username, hash);
                }
            });
        }
    });
});


app.post("/login", (req, res) => {
    const { username, password } = req.body;

    let sql = `SELECT * FROM users WHERE username=?`;
    db.query(sql, [username], (err, queryResults) => {
        if (!err) {
            console.log(queryResults);
            if (queryResults.length != 0) {
                bcrypt.compare(password, queryResults[0].password, (err, passwordCheck) => {
                    if (!err) {
                        if (passwordCheck) {
                            console.log("Password is correct!");

                            const claims = {
                                username: username,
                                userId: queryResults[0].userID,
                            };
                            const header = {
                                alg: "HS512",
                                typ: "JWT",
                            };

                            const sJWT = GenerateJWT(header, claims, key);

                            res.send({
                                userExists: true,
                                passwordCorrect: true,
                                token: sJWT,
                            });
                            
                        } else {
                            console.log("Password incorrect :(");
                            res.send({
                                userExists: true,
                                passwordCorrect: false,
                            });
                        }
                    } else {
                        throw err;
                    }
                });
            } else {
                res.send({
                    userExists: false,                    
                });
            }
        } else {
            throw err;
        }
    })

});



// Add expense entry

app.post("/expenses", (req, res) => {
    const authStr = req.headers.authorization;
    const token = authStr.slice(7);

    if (ValidateJWT(token, key)) {
        const userDetails = DecodeJWT(token);
        const userID = userDetails.userId;
        let expense = {
            ...req.body,
            amount: parseFloat(req.body.amount),
            userID: userID,
        };
        insertExpenseIntoDB(res, db, expense);
    } else {
        res.send(false);
    }
});

// Get all expenses

app.get("/expenses", (req, res) => {
    const authStr = req.headers.authorization;
    const token = authStr.slice(7);

    if (ValidateJWT(token, key)) {
        const userDetails = DecodeJWT(token);
        const userID = userDetails.userId;
        retrieveAllExpenses(res, db, userID);
    } else {
        res.send(false);
    }
    
});

// Delete Expense

app.post("/deleteexpenses", (req, res) => {

    const idList = req.body.idList;
    const sqlIdString = stringifyIds(idList);
    deleteExpenses(res, db, sqlIdString);
});

// Get all categories

app.get("/categories", (req, res) => {
    const authStr = req.headers.authorization;
    const token = authStr.slice(7);

    if (ValidateJWT(token, key)) {
        const userDetails = DecodeJWT(token);
        const userID = userDetails.userId;
        retrieveAllCategories(res, db, userID);
    } else {
        res.send(false);
    }

});

//Add a new category
app.post("/categories", (req, res) => {
    const authStr = req.headers.authorization;
    const token = authStr.slice(7);

    if (ValidateJWT(token, key)) {
        const userDetails = DecodeJWT(token);
        const categoryName = req.body.categoryName;
        const userID = userDetails.userId;
        addCategoryToDB(res, db, {categoryName, userID});
    } else {
        res.send(false);
    }
});

//Delete a category
app.delete("/categories/:categoryID", (req, res) => {
    const categoryID = req.params.categoryID;
    const authStr = req.headers.authorization;
    const token = authStr.slice(7);

    if (ValidateJWT(token, key)) {
        deleteCategory(res, db, categoryID);
    } else {
        res.send(false);
    }
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


