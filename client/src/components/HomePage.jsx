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
        email: credentials.email,
        password: credentials.password,
    }))
    .then(response => response.data.token)
    .catch(error => console.log(error));
}

export default function HomePage({ setToken }) {    
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    function handleChange(event) {
        const {name, value} = event.target;

        setUserInfo(prevValue => ({
            ...prevValue,
            [name]: value,
        }));
    }

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(e);
        const token = await loginUser({
            email: userInfo.email,
            password: userInfo.password
        });
        setToken(token);
    }

    return (
        <div>
            <Header />
            <div>
                <form className={classes.root} onSubmit={handleSubmit}>
                    <h1 className={classes.heading}>Welcome!</h1>
                    <label className={classes.label}>Email:</label>
                    <TextField 
                        className={classes.textInput} 
                        value={userInfo.email} 
                        onChange={handleChange} 
                        fullWidth="true" 
                        name="email"
                        type="text" />

                    <label className={classes.label}>Password:</label>
                    <TextField 
                        className={classes.textInput}
                        value={userInfo.password} 
                        onChange={handleChange} 
                        fullWidth="true"
                        name="password"
                        type="password" />
                
                    <Button 
                        className={classes.submitButton}
                        type="submit"
                        variant="contained" 
                        color="primary">Login
                    </Button>
                    <Button 
                        className={classes.submitButton}
                        type="submit"
                        variant="contained" 
                        color="primary">Sign Up
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