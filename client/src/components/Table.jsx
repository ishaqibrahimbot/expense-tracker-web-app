import React from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@material-ui/core";

export default function ExpenseTable(props) {

    function createEntries(expenseEntry) {
        return (
            <TableRow key={expenseEntry.description}>
                <TableCell>{expenseEntry.description}</TableCell>
                <TableCell>{expenseEntry.amount}</TableCell>
                <TableCell>{expenseEntry.category}</TableCell>
                <TableCell>{expenseEntry.date.toLocaleString()}</TableCell>
            </TableRow>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.expenseList.map(createEntries)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}