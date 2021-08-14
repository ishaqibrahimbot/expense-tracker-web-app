import React from "react";
import HomePage from "./HomePage";
import ExpenseApp from "./ExpenseApp";
import useToken from "../useToken";


export default function App() {
    const {setToken, token} = useToken();
    

    if(!token) {
        return <HomePage setToken={setToken}/>;
    }

    return <ExpenseApp token={token}/>;
}
