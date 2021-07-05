import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@material-ui/core";

const useStyles = makeStyles({
    expenseTable: {
        margin: "20px 20px",
        backgroundColor: "whitesmoke",
        borderRadius: "20px",
        padding: "1%"
    },

    tableHeader: {
        fontSize: "1rem",
        fontFamily: "'Montserrat', sans-serif",
        textAlign: "center",
        fontWeight: "600"
    },

    tableCell: {
        fontFamily: "'Montserrat', sans-serif",
        textAlign: "center"
    }
});

export default function ExpenseTable(props) {
    const classes = useStyles();

    function createEntries(expenseEntry) {
        return (
            <TableRow key={expenseEntry.description}>
                <TableCell classes={{root: classes.tableCell}}>{expenseEntry.description}</TableCell>
                <TableCell classes={{root: classes.tableCell}}>{expenseEntry.amount}</TableCell>
                <TableCell classes={{root: classes.tableCell}}>{expenseEntry.category}</TableCell>
                <TableCell classes={{root: classes.tableCell}}>{expenseEntry.date.toLocaleString()}</TableCell>
            </TableRow>
        );
    }

    return (
        <TableContainer 
            classes={{
                root: classes.expenseTable, // class name, e.g. `classes-nesting-root-x`
                }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell classes={{root: classes.tableHeader}}>Description</TableCell>
                        <TableCell classes={{root: classes.tableHeader}}>Amount</TableCell>
                        <TableCell classes={{root: classes.tableHeader}}>Category</TableCell>
                        <TableCell classes={{root: classes.tableHeader}}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.expenseList.map(createEntries)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}