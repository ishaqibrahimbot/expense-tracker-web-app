import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Form from "./Form";
import ExpenseTable from "./Table";
// import EnhancedTable from "./EnhancedTable";
const axios = require("axios");
const qs = require("qs");
const _ = require("lodash");

function App(props) {
    const [isLoading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState([]);

    function sortExpensesUsingDate(unsortedExpenses) {
        return _.orderBy(unsortedExpenses, (expenseObject => new Date(expenseObject.date)), 'desc');
    }

    useEffect(() => {
        axios.get('/expenses')
        .then(response => {
            setExpenses(sortExpensesUsingDate(response.data));
            setLoading(false);
        })
        .catch(error => console.log(error))
        .then(() => console.log("Successfully retrieved all expenses!"));
    }, []);

    if (isLoading) {
        return (<div>
            <Header />
            <div className="form-table-container">
                <Form onAdd={addExpense}/>
                <ExpenseTable expenseList={[]} />
            </div>
            <Footer />
        </div>)
    }

    function addExpense(newExpense) {
        console.log(newExpense);
        axios.post('/expenses', qs.stringify({
            description: newExpense.description,
            amount: parseFloat(newExpense.amount),
            category: newExpense.category,
            date: newExpense.date.toLocaleDateString()
        }))
        .then(response => console.log(response))
        .catch(error => console.log(error));
    }

    return (<div>
                <Header />
                <div className="form-table-container">
                    <Form onAdd={addExpense}/>
                    <ExpenseTable expenseList={expenses} />
                </div>
                <Footer />
            </div>);
}

export default App;