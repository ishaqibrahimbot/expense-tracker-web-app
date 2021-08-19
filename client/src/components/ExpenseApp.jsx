import React, {useState, useEffect} from "react";
import Header from "./Header";
import Footer from "./Footer";
import Form from "./Form";
import EnhancedTable from "./EnhancedTable";
import CategoriesDialog from "./CategoriesDialog";

const axios = require("axios");
const qs = require("qs");

export default function ExpenseApp({ token, setToken, setFailedJWTValidation, setDisplayMessage }) {
    const [isLoading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState([]);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [categories, setCategories] = useState([]);

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

    
    function fetchCategories() {
        axios.get("/categories", { headers: { Authorization: authStr } } )
        .then(response => {
            if (response.data !== false) {
                console.log(response.data);
                setCategories(response.data);
            } else {
                setToken(false);
                setFailedJWTValidation(true);
                setDisplayMessage(true);
            }   
        })
    }
    
    const logOutHandler = () => {
        localStorage.removeItem('token');
        setToken(false);
    };

    const manageCategoriesHandler = () => {
        setCategoriesOpen(true);
    }

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    if (isLoading) {
        return (
        <div>
            <Header
                showLinks={true}
                logOutHandler={logOutHandler}
                manageCategoriesHandler={manageCategoriesHandler} 
            />
            <CategoriesDialog open={categoriesOpen} setOpen={setCategoriesOpen} categories={categories}
                setCategories={setCategories} addNewCategory={addNewCategory} deleteCategory={deleteCategory}
            />
            <div className="form-table-container">
                <Form 
                    onAdd={addExpense} 
                    token={token}
                    setToken={setToken}
                    setFailedJWTValidation={setFailedJWTValidation}
                    setDisplayMessage={setDisplayMessage}
                    categories={categories}
                    />
                <EnhancedTable expenseList={[]} />
            </div>
            <Footer />       
        </div>)
    }

    function addNewCategory(newCategory) {
        console.log(newCategory);
        axios.post("/categories", qs.stringify({
            categoryName: newCategory,
        }), { headers: { 'Authorization': authStr } })
        .then(response => {
            if (response.data !== false) {
                console.log(response.data);
                fetchCategories();
            } else {
                setToken(false);
                setFailedJWTValidation(true);
                setDisplayMessage(true);
            }
        })
        .catch(error => console.log(error));
    }

    function deleteCategory(selectedCategory) {
        console.log(selectedCategory);
        axios.delete(`/categories/${selectedCategory.categoryID}`, { headers: { Authorization: authStr } } )
        .then(response => {
            if (response.data !== false) {
                console.log(response.data);
                fetchCategories();
            } else {
                setToken(false);
                setFailedJWTValidation(true);
                setDisplayMessage(true);
            }   
        })
        .catch(error => console.log(error))
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
        <Header 
            showLinks={true}
            logOutHandler={logOutHandler}
            manageCategoriesHandler={manageCategoriesHandler}
        />
        <CategoriesDialog open={categoriesOpen} setOpen={setCategoriesOpen} categories={categories}
            setCategories={setCategories} addNewCategory={addNewCategory} deleteCategory={deleteCategory}
        />
        <div className="form-table-container">
            <Form   
                onAdd={addExpense} 
                token={token}
                setToken={setToken}
                setFailedJWTValidation={setFailedJWTValidation}
                setDisplayMessage={setDisplayMessage}
                categories={categories}
                />
            <EnhancedTable expenseList={expenses} onDelete={deleteExpense} />
        </div>
        <Footer />       
    </div>);
}