import React, { useState } from "react";
import {Button, TextField, Select, MenuItem} from '@material-ui/core';
import DatePicker from "react-date-picker";


export default function Form({ onAdd, categories}) {

    const [expense, setExpense] = useState({
        description: "",
        amount: "",
        category: "",
        date: new Date()
    });

    function addMenuItems(menuItem, index) {
        return (<MenuItem value={menuItem.categoryName} key={index}>{menuItem.categoryName}</MenuItem>);
    }

    function handleChange(event) {
        const {name, value} = event.target;

        setExpense(prevExpense => {
            return {
                ...prevExpense,
                [name]: value
            };
        });
    }

    function handleDateChange(event) {
        console.log(event);
        const newDate = event;
        setExpense(prevExpense => {
            return {
                ...prevExpense,
                date: newDate
            }
        })
    }

    function submitExpense(event) {
        onAdd(expense);
        setExpense(prevExpense => ({
                description: "",
                amount: "",
                category: "",
                date: prevExpense.date,
        }));
        event.preventDefault();
    }
    

    return (
        <div className="input-form">
            <form>
                <h1>New Expense</h1>

                <label>Description</label>
                <TextField 
                    className="text-input" 
                    value={expense.description} 
                    onChange={handleChange} 
                    fullWidth={true} 
                    size="small" 
                    name="description"/>

                <label>Amount</label>
                <TextField 
                    className="text-input" 
                    value={expense.amount} 
                    onChange={handleChange} 
                    fullWidth={true} 
                    size="small" 
                    name="amount" />

                <label>Category</label>
                <Select 
                    className="category-selector" 
                    name="category" 
                    value={expense.category} 
                    onChange={handleChange}>
                    {categories.map(addMenuItems)}
                </Select>

                <label>Date</label>
                <DatePicker 
                    className="date-input" 
                    value={expense.date} 
                    onChange={handleDateChange} 
                    name="date" />

                <div className="submit-button">
                <Button 
                    type="submit"
                    onClick={submitExpense} 
                    variant="contained" 
                    color="primary">Add
                </Button>
                </div>
            </form>
        </div>
    );
}
