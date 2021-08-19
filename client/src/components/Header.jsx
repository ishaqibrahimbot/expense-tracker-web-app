import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";

const useHeaderStyles = makeStyles(theme => ({
    header: {
        display: 'flex',
        flexDirection: 'row',
    },
    navBarItems: {
        marginLeft: 'auto',
        marginRight: '1rem',
    },
    headingLeft: {
        textAlign: 'left',
        marginLeft: '1rem',
    },
    actionLinks: {
        fontSize: '1.15rem',
        color: 'white',
        margin: '0 0.25rem',
        textAlign: 'right',
    }
}));

function Header({ showLinks, logOutHandler, manageCategoriesHandler }) {
    const classes = useHeaderStyles();

    return (
        <header className={showLinks && classes.header}>
            <div><h1 className={showLinks && classes.headingLeft}>Expense Tracker</h1></div>
            {showLinks && (<div className={classes.navBarItems}>
                <IconButton 
                    className={classes.actionLinks}
                    onClick={manageCategoriesHandler}
                    >Manage Categories</IconButton>
                <IconButton 
                    className={classes.actionLinks}
                    onClick={logOutHandler}
                    >Logout</IconButton>
            </div>)}
        </header>
    );
}

export default Header;