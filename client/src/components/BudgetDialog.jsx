import React, { useState } from 'react';
import { Button, Dialog, DialogTitle } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    dialogHeading: {
        margin: "0 auto",
    },
}));

const BudgetDialog = props => {
    const { open, setOpen, categories, setCategories, updateBudgets } = props;

    const classes = useStyles();

    return (
        <Dialog open={open} onClose={() => setOpen(false)} style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}>
            <DialogTitle className={classes.dialogHeading} id="budget-dialog-title">Set Budgets</DialogTitle>
            {categories.map((category, i) => {
                return (
                    <div style={{
                        justifyContent: 'space-between',
                        marginLeft: 20,
                        marginBottom: 10,
                        marginRight: 20,
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                        key={i}
                    >
                        <div style={{
                            marginRight: 20,
                        }}>
                            <p>{category.categoryName}</p>
                        </div>
                        <div>
                            <TextField
                                value={category.budget === null ? "" : category.budget}
                                onChange={event => {
                                    setCategories(prevCategories => {
                                        let newCategories = [...prevCategories];
                                        newCategories[i].budget = parseInt(event.target.value);
                                        return newCategories;
                                    })
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            <Button 
                variant="contained"
                color="primary"
                onClick={() => {
                    updateBudgets(categories.map(category => ({budget: category.budget, id: category.categoryID})));
                    setOpen(false);
                }}
                >
                Save
            </Button>
        </Dialog>
    );
}

export default BudgetDialog;