import React, {useState} from "react";
import HomePage from "./HomePage";
import ExpenseApp from "./ExpenseApp";
import {BrowserRouter, Route, Switch} from "react-router-dom";

export default function App() {
    const [token, setToken] = useState();

    if(!token) {
        return <HomePage setToken={setToken}/>;
    }

    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/dashboard" component={ExpenseApp} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}
