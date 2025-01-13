const AggregatedTransaction = require('../models/AggregatedTransaction');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const getMonthName = (date) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[date.getMonth()];
};

exports.aggregateTransactionData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: 'User not found in request' });
    }

    const incomes = await Income.find({ user: req.user });
    const expenses = await Expense.find({ user: req.user });

    // Initialize aggregatedData with all months set to zero
    const aggregatedData = {};
    for (let i = 0; i < 12; i++) {
      const month = getMonthName(new Date(2025, i));  // Use any year, just to get the month names
      aggregatedData[month] = { incomePerMonth: 0, expensePerMonth: 0 };
    }

    // Calculate income per month
    incomes.forEach(income => {
      if (income.date instanceof Date && !isNaN(income.date)) {
        const month = getMonthName(income.date);
        aggregatedData[month].incomePerMonth += income.amount;
      }
    });

    // Calculate expense per month
    expenses.forEach(expense => {
      if (expense.date instanceof Date && !isNaN(expense.date)) {
        const month = getMonthName(expense.date);
        aggregatedData[month].expensePerMonth += expense.amount;
      }
    });

    // Aggregate the data and update or insert into database
    const updatePromises = Object.keys(aggregatedData).map(async month => {
      const { incomePerMonth, expensePerMonth } = aggregatedData[month];
      const netSavingsPerMonth = incomePerMonth - expensePerMonth;

      // Update if exists, otherwise insert
      return AggregatedTransaction.findOneAndUpdate(
        { user: req.user, month },
        { incomePerMonth, expensePerMonth, netSavingsPerMonth },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    });

    await Promise.all(updatePromises);

    // Fetch the updated aggregated transactions
    const aggregatedTransactions = await AggregatedTransaction.find({ user: req.user }).sort({ month: 1 });

    // Format the data for the frontend
    const formattedData = aggregatedTransactions.map((transaction) => ({
      name: transaction.month,
      income: transaction.incomePerMonth,
      expense: transaction.expensePerMonth,
      Net_Savings: transaction.netSavingsPerMonth,
    }));

    res.status(201).json(formattedData);
  } catch (error) {
    res.status(500).json({ msg: 'Error aggregating transaction data', error });
  }
};