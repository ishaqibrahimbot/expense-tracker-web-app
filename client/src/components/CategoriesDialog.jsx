import React, {useState} from "react";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
import CategoriesChips from "./CategoriesChip";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { TextField, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    entryField: {
        margin: "0.5rem auto",
    },
    dialogHeading: {
        margin: "0 auto",
    },
}));

export default function CategoriesDialog({ open, setOpen, categories, setCategories, addNewCategory, deleteCategory }) {
    const [newCategory, setNewCategory] = useState("");
    const classes = useStyles();

    const handleChange = event => {
        const inputCategory = event.target.value;
        setNewCategory(inputCategory);
    };

    const handleAddNewCategory = () => {
        addNewCategory(newCategory);
        setNewCategory("");
    }
    
    return (
        <Dialog aria-labelledby="categories-dialog-title" open={open} onClose={() => setOpen(false)}>
            <DialogTitle className={classes.dialogHeading} id="categories-dialog-title">Add/Delete Categories</DialogTitle>
            <div className={classes.entryField}>
                <TextField 
                    value={newCategory}
                    onChange={handleChange}
                />
                <IconButton onClick={handleAddNewCategory}><AddCircleIcon /></IconButton>
            </div>
            <CategoriesChips categories={categories} setCategories={setCategories} deleteCategory={deleteCategory}/>
            <Button 
                variant="contained"
                color="primary"
                onClick={() => setOpen(false)}
                >
                Save
            </Button>
        </Dialog>
    );
}

// <TextField 
//                     className="text-input" 
//                     value={expense.description} 
//                     onChange={handleChange} 
//                     fullWidth={true} 
//                     size="small" 
//                     name="description"/>

// <Button 
//                     type="submit"
//                     onClick={submitExpense} 
//                     variant="contained" 
//                     color="primary">Add
//                 </Button>