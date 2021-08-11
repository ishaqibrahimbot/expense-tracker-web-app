import React, { useState } from "react";
import HomePage from "./HomePage";
import ExpenseApp from "./ExpenseApp";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import useToken from "../useToken";


export default function App() {
    const {setToken, token} = useToken();
    const [displayMessage, setDisplayMessage] = useState(false);

    const triggerLogin = () => {
        console.log("Signed up successfully!");
        setDisplayMessage(true);
    };

    if(!token) {
        return <HomePage 
                    setToken={setToken} 
                    triggerPostSignupLogin={triggerLogin}
                    displayMessage={displayMessage}
                    />;
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
