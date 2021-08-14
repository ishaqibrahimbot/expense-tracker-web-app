import React, {useState} from "react";
import HomePage from "./HomePage";
import ExpenseApp from "./ExpenseApp";
import useToken from "../useToken";


export default function App() {
    const {setToken, token} = useToken();
    const [failedJWTValidation, setFailedJWTValidation] = useState();
    const [displayMessage, setDisplayMessage] = useState(false);
    

    if(!token) {
        return <HomePage 
                setToken={setToken} 
                failedJWTValidation={failedJWTValidation}
                setFailedJWTValidation={setFailedJWTValidation}
                displayMessage={displayMessage}
                setDisplayMessage={setDisplayMessage}
                />;
    }

    return <ExpenseApp 
                token={token} 
                setToken={setToken} 
                setFailedJWTValidation={setFailedJWTValidation}
                setDisplayMessage={setDisplayMessage}
                />;
}
