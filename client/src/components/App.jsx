import React, {useState} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Form from "./Form";
import ExpenseTable from "./Table";

function App() {

    const [expenses, setExpenses] = useState([]);

    function addExpense(newExpense) {
        console.log(newExpense);
        setExpenses(prevValue => [newExpense, ...prevValue]);
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