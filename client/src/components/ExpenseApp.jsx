import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Form from "./Form";
import EnhancedTable from "./EnhancedTable";

const axios = require("axios");
const qs = require("qs");

export default function ExpenseApp({ token }) {
    const [isLoading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState([]);



    function fetchData() {
        axios.get('/expenses')
        .then(response => {
            console.log(response.data);
            setExpenses(response.data);
            setLoading(false);
        })
        .catch(error => console.log(error))
        .then(() => console.log("Successfully retrieved all expenses!"));
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
        }))
        .then(response => console.log(response))
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

        // let idString = "";
        // selectedExpenses.forEach(expenseItem => {
        //     idString = idString + expenseItem.id.toString() + "+";
        // });
        // idString = idString.slice(0, -1);

        // axios.delete(`/expenses/${idString}`)
        // .then(response => console.log(response))
        // .catch(error => console.log(error))
        // .then(() => fetchData());
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