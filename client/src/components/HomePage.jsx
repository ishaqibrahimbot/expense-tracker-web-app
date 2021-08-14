import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import Footer from "./Footer";
import {Button, TextField} from '@material-ui/core';
import PropTypes from "prop-types";

const qs = require('qs');
const axios = require('axios');

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '30%',
        backgroundColor: 'whitesmoke',
        margin: '5rem auto',
        padding: '1.8%',
        borderRadius: '1.6rem',
        boxShadow: '0 2px 5px #ccc',
    },
    heading: {
        fontSize: '1.5rem',
        textAlign: 'center',
    },
    label: {
        textAlign: 'left',
        fontSize: '1rem',
        display: 'block',
        color: '#6C7A89',
    },
    textInput: {
        margin: '0.25rem 0 1.5rem 0',
    },
    submitButton: {
        width: '30%',
        margin: '0.8rem auto',        
    }
}))

async function loginUser(credentials) {
    return axios.post("/login", qs.stringify({
        username: credentials.email,
        password: credentials.password,
    }))
    .then(response => response.data)
    .catch(error => console.log(error));
}

async function signupUser(credentials) {
    return axios.post("/register", qs.stringify({
        username: credentials.email,
        password: credentials.password,
    }))
    .then(response => response.data.success)
    .catch(error => console.log(error));
}

export default function HomePage({ setToken }) {
    const classes = useStyles();
    const [displayMessage, setDisplayMessage] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        strong: "",
        pTag: "",
    });
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    const signupSuccessMessage = {
        strong: "Signed up successfully!",
        pTag: " Please log in to continue to the app.",
    };

    const signupFailureMessage = {
        strong: "Oops! There was an error during sign up.",
        pTag: " Please try again after refreshing the webpage.",
    };

    const noMatchingUserMessage = {
        strong: "Sorry! This user does not exist in our database.",
        pTag: " Please sign up first to access this application."
    };

    const incorrectPasswordMessage = {
        strong: "Incorrect or empty password!",
        pTag: " Please try again.",
    };
    

    function handleChange(event) {
        const {name, value} = event.target;

        setUserInfo(prevValue => ({
            ...prevValue,
            [name]: value,
        }));
    }

    const triggerLogin = () => {
        console.log("Signed up successfully!");
        setAlertMessage(signupSuccessMessage);
        setDisplayMessage(true);
    }

    const triggerSignUpRetry = () => {
        console.log("Error during sign up. Try again!");
        setAlertMessage(signupFailureMessage);
        setDisplayMessage(true);
    }

    const handleLogin = async e => {
        e.preventDefault();
        const responseData = await loginUser({
            email: userInfo.email,
            password: userInfo.password,
        });

        if (!responseData.userExists) {
            setAlertMessage(noMatchingUserMessage);
            setDisplayMessage(true);
        } else if (!responseData.passwordCorrect) {
            setAlertMessage(incorrectPasswordMessage);
            setDisplayMessage(true);
        } else {
            const token = responseData.token;
            console.log(token);
            setToken(token);
        }
    }

    const handleSignup = async e => {
        e.preventDefault();
        const status = await signupUser({
            email: userInfo.email,
            password: userInfo.password,
        });
        if (status) {
            triggerLogin();
        } else {
            triggerSignUpRetry();
        }
    }

    return (
        <div>
            <Header />
            {displayMessage && (<div className="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>{alertMessage.strong}</strong> {alertMessage.pTag}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>)}
            <div>
                <form className={classes.root}>
                    <h1 className={classes.heading}>Welcome!</h1>
                    <label className={classes.label}>Email:</label>
                    <TextField 
                        className={classes.textInput} 
                        value={userInfo.email} 
                        onChange={handleChange} 
                        fullWidth={true} 
                        name="email"
                        type="text" />

                    <label className={classes.label}>Password:</label>
                    <TextField 
                        className={classes.textInput}
                        value={userInfo.password} 
                        onChange={handleChange} 
                        fullWidth={true}
                        name="password"
                        type="password" />
                
                    <Button 
                        className={classes.submitButton}
                        type="submit"
                        variant="contained" 
                        color="primary"
                        onClick={handleLogin}>Login
                    </Button>
                    <Button 
                        className={classes.submitButton}
                        type="submit"
                        variant="contained" 
                        color="primary"
                        onClick={handleSignup}>Sign Up
                    </Button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

HomePage.propTypes = {
    setToken: PropTypes.func.isRequired,
};