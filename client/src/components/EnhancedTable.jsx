import React, {useState} from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {lighten, makeStyles} from "@material-ui/core/styles";
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import { Typography, Paper, Checkbox, IconButton, Tooltip, FormControlLabel, Switch } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import MediaQuery, {useMediaQuery} from 'react-responsive';

// Now we have some kind of functions that enhance the basic sorting function already present in JS.

function descendingComparator(a, b, orderBy) {
    
    if (orderBy === "date") {
        let a_date = new Date(a[orderBy]);
        let b_date = new Date(b[orderBy]);

        if (b_date < a_date) {
            return 1;
        }
        if (b_date > a_date) {
            return -1;
        }
        return 0;

    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

/* Okay so I was genuinely confused about this function, but it is doing literally what it says, i.e. stable sorting. This means that if two elements are equal, the sorting algorithm maintains the original order. So this is how this works: we create a new array out of the original one that has each element as the original element AND its index. Now, we use the sort function on THIS NEW ARRAY, and pass in the elements as we would normally for sorting. But then we keep a condition so that if the order returned is 0, i.e. both elements are equal, we use the INDEX to sort, making sure WHAT CAME FIRST REMAINS FIRST if the two elements are equal. Finally, at the end we just reverse the mapping we did earlier in which we converted an element-only array to an [element, index] array and simply return the element only to the map function to get the final sorted array.*/

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

const headCells = [
    { id: 'description', numeric: false, disablePadding: false, label: 'Description'},
    { id: 'amount', numeric: true, disablePadding: false, label: 'Amount'},
    { id: 'category', numeric: false, disablePadding: false, label: 'Category'},
    { id: 'date', numeric: false, disablePadding: false, label: 'Date'}    
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort, isMobile} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <MediaQuery minWidth={520}>
                    <TableCell padding="checkbox"></TableCell>
                </MediaQuery>
                {headCells.map(headCell => (
                    <TableCell 
                        key={headCell.id}
                        className={isMobile ? classes.tableHeaderMobile : classes.tableHeader}
                        align='left'
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}>
                        <TableSortLabel 
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        marginTop: "20px"
    },
    highlight:
        theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
        },
    title: {
        flex: '1 1 100%',
        fontSize: "1.25rem",
        fontFamily: "'Montserrat', sans-serif",
        textAlign: "center",
        fontWeight: "600"
    },
}));

function EnhancedTableToolbar(props) {
    const classes = useToolbarStyles();
    const {numSelected, onDelete} = props;

    return (
        <Toolbar className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
        })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inhert" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    All Expenses
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" onClick={() => onDelete()}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton aria-label="filter list">
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        position: "relative",
    },
    paper: {
        width: "100%",
        backgroundColor: "whitesmoke",
        borderRadius: "1.6rem",
        marginBottom: theme.spacing(2)
    },
    table: {
    },
    tableHeader: {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "0.9rem",
        fontWeight: "600"
    },
    tableHeaderMobile: {
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "0.5rem",
        fontWeight: "600",
        padding: "6px 10px 6px 10px",
    },
    tableCell: {
        fontSize: "0.8rem",
    },
    tableCellMobile: {
        fontSize: "0.5rem",
        padding: "6px 10px 6px 10px",
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    },
}));

export default function EnhancedTable(props) {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('date');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const {expenseList, onDelete} = props;

    let numSelected = selected.length;
    let rowCount = expenseList.length;

    const isMobile = useMediaQuery({query: '(max-width: 520px'});
    // const isDesktop = useMediaQuery({query: '(min-width: 520px'});
    

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if(event.target.checked) {
            const newSelecteds = expenseList.map(expenseItem => expenseItem.description);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDenseChange = event => {
        setDense(event.target.checked);
    };

    const handleDelete = () => {
        const selectedExpenses = expenseList.filter(expenseItem => (selected.includes(expenseItem.description)));
        onDelete(selectedExpenses);
        setSelected([]);
    };

    function getStandardDateString(dateString) {
        let date = new Date(dateString);
        const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
        const newDateString = day.toString() + "-" + (month+1).toString() + "-" + year.toString();
        return newDateString;
    }

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, expenseList.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length} onDelete={handleDelete}/>
                <TableContainer>
                    <Table 
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            isMobile={isMobile ? true : false}
                        />
                        <TableBody>
                            {stableSort(expenseList, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((expenseItem, index) => {
                                    const isItemSelected = isSelected(expenseItem.description);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow 
                                            hover
                                            onClick={(event) => handleClick(event, expenseItem.description)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={expenseItem.description}
                                            selected={isItemSelected}
                                        >
                                            <MediaQuery minWidth={520}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox 
                                                        checked={isItemSelected}
                                                        inputProps={{'aria-labelledby': labelId}}
                                                    />
                                                </TableCell>
                                            </MediaQuery>
                                            <TableCell  component="th"
                                                        id={labelId}
                                                        className={isMobile ? classes.tableCellMobile : classes.tableCell}
                                                        scope="row" 
                                                        padding="normal">
                                                {expenseItem.description}
                                            </TableCell>
                                            <TableCell className={isMobile ? classes.tableCellMobile : classes.tableCell}>{expenseItem.amount}</TableCell>
                                            <TableCell className={isMobile ? classes.tableCellMobile : classes.tableCell}>{expenseItem.category}</TableCell>
                                            <TableCell className={isMobile ? classes.tableCellMobile : classes.tableCell}>{getStandardDateString(expenseItem.date)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows}}>
                                        <TableCell colSpan={5} />
                                    </TableRow>
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{textAlign: 'center'}}>
                    <Checkbox 
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={handleSelectAllClick}
                            inputProps={{ 'aria-label': 'Select all expenses' }}
                            style={{display: "inline-block"}}
                        />
                        <p style={{display: "inline-block", fontSize: "0.8rem"}}>Select/Deselect All</p>
                </div>  
                <TablePagination 
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={expenseList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleDenseChange}/>}
                label="Dense padding"
            />
        </div>
    );
}