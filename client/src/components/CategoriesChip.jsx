import React, { useState } from "react";
import { Chip, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  }));

export default function CategoriesChips({ categories, deleteCategory }) {
    const classes = useStyles();

    const handleDelete = (categoryToDelete) => () => {
        deleteCategory(categoryToDelete);
    };

    return (
        <Paper component="ul" className={classes.root}>
            {categories.map(category => (                 
                <Chip 
                    key={category.categoryID}
                    label={category.categoryName}
                    onDelete={handleDelete(category)}
                    className={classes.chip}
                />
            ))}
        </Paper>
    );
}