const mysql = require("mysql");

//Add all the queries and package them into functions to be exported!
//i.e. to add and delete expenses, to sign up, login, and validate users, etc

// Create MySQL connection
const devDatabaseString = {
    host: "localhost",
    user: "root",
    password: "",
    database: "expensedb"
};

function connectToMySQLDatabase() {
    const db = mysql.createConnection(process.env.JAWSDB_URL ? process.env.JAWSDB_URL : devDatabaseString);

    db.connect((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("My SQL connected!");
        }
    });

    return db;
}

function addUser(res, db, username, hash) {
    let sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    return db.query(sql, [username, hash], (err, result) => {
        if (err) {
            console.log(err);
            res.send({success: false});
        } else {
            console.log(result);
            res.send({success: true});
        }
    })

}

function retrieveAllExpenses(res, db, userID) {
    let sql = `SELECT * FROM expenses WHERE userID = ?`;
    db.query(sql, [userID], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(JSON.stringify(result));
        }
    });
}

function insertExpenseIntoDB(res, db, expense) {
    let sql = `INSERT INTO expenses SET ?`;
    db.query(sql, expense, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(`Successfully added:\n${expense}`);
            res.send("Successfully added a new entry...");
        }
    });
}

function deleteExpenses(res, db, sqlIdString) {
    let sql = `DELETE FROM expenses WHERE id IN ${sqlIdString}`;
    db.query(sql, [], (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log(result);
            res.send("Deleted the post...");
        }
    });
}

function stringifyIds(idsToBeDeleted) {
    let sqlString = "(";
    idsToBeDeleted.forEach(id => {
        sqlString = sqlString + id + ",";
    });
    sqlString = sqlString.slice(0, -1) + ")";
    return sqlString;
}

module.exports = {
    stringifyIds,
    connectToMySQLDatabase,
    insertExpenseIntoDB,
    retrieveAllExpenses,
    deleteExpenses,
    addUser,
}