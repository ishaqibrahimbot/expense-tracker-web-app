import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Form from "./Form";
import EnhancedTable from "./EnhancedTable";

const axios = require("axios");
const qs = require("qs");

export default function ExpenseApp({ token, setToken, setFailedJWTValidation, setDisplayMessage }) {
    const [isLoading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState([]);

    const authStr = "Bearer ".concat(token);

    function fetchData() {
        axios.get('/expenses', { headers: { Authorization: authStr } })
        .then(response => {
            if (response.data !== false) {
                console.log(response.data);
                setExpenses(response.data);
                setLoading(false);
            } else {
                setToken(false);
                setFailedJWTValidation(true);
                setDisplayMessage(true);
            }
            
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
        <div>
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
            date: newExpense.date,
        }), { headers: { 'Authorization': authStr } })
        .then(response => {
            if (response.data !== false) {
                console.log(response.data);
            } else {
                setToken(false);
                setFailedJWTValidation(true);
                setDisplayMessage(true);
            }
        })
        .catch(error => console.log(error))
        .then(() => fetchData());
    }

    function deleteExpense(selectedExpenses) {

        const idList = selectedExpenses.map(expenseItem => expenseItem.id);

        axios.post("/deleteexpenses", qs.stringify({
            idList: idList,
        }))
        .then(response => console.log(response))
        .catch(error => console.log(error))
        .then(() => fetchData());
    }

    return (
    <div>
        <Header />
        <div className="form-table-container">
            <Form onAdd={addExpense}/>
            <EnhancedTable expenseList={expenses} onDelete={deleteExpense} />
        </div>
        <Footer />       
    </div>);
}