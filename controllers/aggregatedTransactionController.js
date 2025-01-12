const aggregatedTransactionController = require('../controllers/aggregatedTransactionController');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const getMonthName = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()];
};

exports.aggregateTransactionData = async (req, res) => {
try {
    const incomes = await Income.find({ user: req.user });
    const expenses = await Expense.find({ user: req.user });

    const aggregatedData = {};
    
    // income calculate
    incomes.forEach(income => {
    const month = getMonthName(income.date);
    if (!aggregatedData[month]) {
        aggregatedData[month] = { incomePerMonth: 0, expensePerMonth: 0 };
    }
    aggregatedData[month].incomePerMonth += income.amount;
    });

    // expense calculate
    expenses.forEach(expense => {
    const month = getMonthName(expense.date);
    if (!aggregatedData[month]) {
        aggregatedData[month] = { incomePerMonth: 0, expensePerMonth: 0 };
    }
    aggregatedData[month].expensePerMonth += expense.amount;
    });

    // net savings calculate and adding to database
    const aggregatedTransactions = Object.keys(aggregatedData).map(month => {
    return {
        user: req.user,
        month,
        incomePerMonth: aggregatedData[month].incomePerMonth,
        expensePerMonth: aggregatedData[month].expensePerMonth,
        netSavingsPerMonth: aggregatedData[month].incomePerMonth - aggregatedData[month].expensePerMonth
    };
    });

    await AggregatedTransaction.insertMany(aggregatedTransactions);

    res.status(201).json({ message: 'Aggregated transaction data saved successfully' });
} catch (error) {
    res.status(500).json({ message: 'Error aggregating transaction data', error });
}
};