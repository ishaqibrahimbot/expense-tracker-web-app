import React, { useState } from "react";
import MediaQuery, {useMediaQuery} from 'react-responsive';


const getFilteredExpenses = expenses => {
    let monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0);
    console.log("MONTH START: ", monthStart.toUTCString());
    
    let filteredExpenses = expenses.filter((expense, i) => {
        return new Date(expense.date) >= monthStart;
    });

    return filteredExpenses;
}

const Stats = props => {
    const { expenses, categories } = props;

    const calculateMonthToDate = () => {
        let filteredExpenses = getFilteredExpenses(expenses);

        if (filteredExpenses.length > 0){
            return filteredExpenses
                .map(expense => expense.amount)
                .reduce((prev, curr) => (prev + curr));
        } else {
            return 0;
        }
    };
    

    const getRemainingBudget = category => {
        let filteredExpenses = getFilteredExpenses(expenses);
        let filteredForCategory = filteredExpenses.filter(expense => expense.category === category.categoryName);

        if (filteredForCategory.length > 0) {
            const totalSpent = filteredForCategory
                                    .map(expense => expense.amount)
                                    .reduce((prev, curr) => (prev + curr));
            return category.budget - totalSpent;
        };

        return category.budget;
    };

    const isMobile = useMediaQuery({query: '(max-width: 520px'});

    let monthToDateExpense;

    if (expenses.length > 0) {
        monthToDateExpense = calculateMonthToDate(expenses);
    } else {
        monthToDateExpense = 0;
    }

    // console.log()

    return (
        <div style={{
            width: isMobile ? '80%' : '35%',
            minHeight: 100,
            display: 'flex',
            paddingBottom: 30,
            flexDirection: 'column',    
            backgroundColor: 'whitesmoke',
            boxShadow: '0 2px 5px #ccc',
            borderRadius: 25,
            justifyContent: 'center',
            alignSelf: 'center',
            margin: '50px auto',
        }}>
            <div style={{
                width: '80%',
                height: 50,
                display: 'flex',
                alignSelf: 'center',
                flexDirection: 'row',
                marginTop: 20,
                paddingTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <p style={{ fontWeight: 'bold', fontSize: 14, color: 'rgba(0, 0, 0, 0.7)', marginRight: 10}}>Month To Date Total: </p>
                <p style={{ fontWeight: 'bold', fontSize: 16}}>{monthToDateExpense}</p>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '90%',
                alignSelf: 'center',
                alignItems: 'center',
                
            }}>
                <p style={{fontWeight: 'bold'}}>Remaining Budgets</p>
                {categories.map((category, i) => {
                    const remainingBudget = getRemainingBudget(category);
                    let remainingWidthPercent;
                    let warning = false;
                    if (remainingBudget < 0) {
                        remainingWidthPercent = "100%";
                        warning = true;
                    } else {
                        const remainingWidth = 100 - (remainingBudget/category.budget)*100;
                        if (remainingWidth > 80) {
                            warning = true;
                        }
                        remainingWidthPercent = `${remainingWidth}%`; 
                    }
                    
                    return (
                            <div style={{
                                display: 'flex',
                                width: 350,
                                height: 35,
                                marginBottom: 5,
                                marginTop: 5,
                                paddingBottom: 5,
                                borderBottom: '1px solid black',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    width: '30%',
                                    height: 20,
                                    fontSize: 13,
                                }}>
                                    <p>{category.categoryName}</p>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    width: '25%',
                                    height: 20,
                                    justifyContent: 'center',
                                }}>
                                    <p>{(expenses.length > 0) && remainingBudget}</p>
                                </div>
                                <div style={{
                                    width: '45%',
                                    display: 'flex',
                                    height: 20,
                                    border: '1px solid black',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    backgroundColor: '#ADD5E7',
                                }}>
                                    <div style={{
                                        width: expenses.length > 0 ? remainingWidthPercent : '0%',
                                        backgroundColor: warning ? '#A80101' : '#303F9F',
                                        height: 20,
                                    }}></div>
                                </div>
                            </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stats;