import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Form from "./Form";
import EnhancedTable from "./EnhancedTable";
const axios = require("axios");
const qs = require("qs");

function App(props) {
    const [isLoading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState([]);


    useEffect(() => {
        axios.get('/expenses')
        .then(response => {
            console.log(response.data);
            setExpenses(response.data);
            setLoading(false);
        })
        .catch(error => console.log(error))
        .then(() => console.log("Successfully retrieved all expenses!"));
    }, [expenses]);

    if (isLoading) {
        return (<div>
            <Header />
            <div className="form-table-container">
                <Form onAdd={addExpense}/>
                <EnhancedTable expenseList={[]} />
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

    function deleteExpense(selectedExpenses) {

        let idString = "";
        selectedExpenses.forEach(expenseItem => {
            idString = idString + expenseItem.id.toString() + "+";
        });
        idString = idString.slice(0, -1);

        axios.delete(`/expenses/${idString}`)
        .then(response => console.log(response))
        .catch(error => console.log(error))
        .then(() => {
            console.log("Successfully deleted the expenses!");
            setExpenses(prevExpenses => (prevExpenses.filter(expenseItem => !(selectedExpenses.includes(expenseItem)))));
        });
    }

    return (<div>
                <Header />
                <div className="form-table-container">
                    <Form onAdd={addExpense}/>
                    <EnhancedTable expenseList={expenses} onDelete={deleteExpense} />
                </div>
                <Footer />
            </div>);
}

export default App;