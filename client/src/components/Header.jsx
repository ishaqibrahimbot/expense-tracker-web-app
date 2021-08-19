import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import {useMediaQuery} from 'react-responsive';


const useHeaderStyles = makeStyles(theme => ({
    header: {
        display: 'flex',
        flexDirection: 'row',
    },
    navBarItems: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: '1rem',
        
    },
    navBarItemsMobile: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: '1rem',
    },
    headingh1: {
        textAlign: 'left',
        marginLeft: '1rem',
    },
    headingh1Mobile: {
        padding: "1.5%",
    },
    actionLinks: {
        fontSize: '1.15rem',
        color: 'white',
        margin: '0 0.25rem',
    },
    actionLinksMobile: {
        fontSize: '0.85rem',
        color: 'white',
        margin: '0 0.25rem',
    }
}));

function Header({ showLinks, logOutHandler, manageCategoriesHandler }) {
    const classes = useHeaderStyles();
    const isMobile = useMediaQuery({query: '(max-width: 520px'});

    return (
        <header className={showLinks && classes.header}>
            <div><h1 className={showLinks && (isMobile ? classes.headingh1Mobile : classes.headingh1)}>Expense Tracker</h1></div>
            {showLinks && (<div className={isMobile ? classes.navBarItemsMobile : classes.navBarItems}>
                <IconButton 
                    className={isMobile ? classes.actionLinksMobile : classes.actionLinks}
                    onClick={manageCategoriesHandler}
                    >Manage Categories</IconButton>
                <IconButton 
                    className={isMobile ? classes.actionLinksMobile : classes.actionLinks}
                    onClick={logOutHandler}
                    >Logout</IconButton>
            </div>)}
        </header>
    );
}

export default Header;