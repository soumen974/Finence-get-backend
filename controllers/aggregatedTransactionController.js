const AggregatedTransaction = require('../models/AggregatedTransaction');
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

    // Calculate income per month
    incomes.forEach(income => {
      const month = getMonthName(income.date);
      if (!aggregatedData[month]) {
        aggregatedData[month] = { incomePerMonth: 0, expensePerMonth: 0 };
      }
      aggregatedData[month].incomePerMonth += income.amount;
    });

    // Calculate expense per month
    expenses.forEach(expense => {
      const month = getMonthName(expense.date);
      if (!aggregatedData[month]) {
        aggregatedData[month] = { incomePerMonth: 0, expensePerMonth: 0 };
      }
      aggregatedData[month].expensePerMonth += expense.amount;
    });

    // Aggregate the data and update or insert into database
    for (const month in aggregatedData) {
      const { incomePerMonth, expensePerMonth } = aggregatedData[month];
      const netSavingsPerMonth = incomePerMonth - expensePerMonth;

      // Update if exists, otherwise insert
      await AggregatedTransaction.findOneAndUpdate(
        { user: req.user, month },
        { incomePerMonth, expensePerMonth, netSavingsPerMonth },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // Fetch the updated aggregated transactions
    const aggregatedTransactions = await AggregatedTransaction.find({ user: req.user }).sort({ month: 1 });

    // Format the data for the frontend
    const formattedData = aggregatedTransactions.map((transaction) => ({
      name: transaction.month,
      income: transaction.incomePerMonth,
      expense: transaction.expensePerMonth,
      Net_Savings: transaction.netSavingsPerMonth,
    }));

    res.status(201).json({ msg: 'Aggregated transaction data fetched successfully', LineChartData: formattedData });
  } catch (error) {
    res.status(500).json({ msg: 'Error aggregating transaction data', error });
  }
};