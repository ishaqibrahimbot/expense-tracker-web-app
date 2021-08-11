import React, { useState } from "react";
import HomePage from "./HomePage";
import ExpenseApp from "./ExpenseApp";
import useToken from "../useToken";


export default function App() {
    const {setToken, token} = useToken();
    const [displayMessage, setDisplayMessage] = useState(false);

    const triggerLogin = () => {
        console.log("Signed up successfully!");
        setDisplayMessage(true);
    }

    if(!token) {
        return <HomePage setToken={setToken} triggerLogin={triggerLogin} displayMessage={displayMessage}/>;
    }

    return <ExpenseApp />;
}
