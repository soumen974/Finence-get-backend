const AggregatedTransaction = require('../models/AggregatedTransaction');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getMonthName = (date) => {
  return MONTH_NAMES[date.getMonth()];
};

exports.aggregateTransactionData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: 'User not found in request' });
    }

    const year = parseInt(req.params.year, 10);
    if (isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year specified' });
    }

    const startDate = new Date(year, 0, 1); 
    const endDate = new Date(year + 1, 0, 1); 

    // console.log(`Aggregating transactions for year: ${year}`); 

    const incomes = await Income.find({ user: req.user, date: { $gte: startDate, $lt: endDate } });
    const expenses = await Expense.find({ user: req.user, date: { $gte: startDate, $lt: endDate } });

    if (incomes.length === 0 && expenses.length === 0) {
      return res.status(404).json({ msg: 'No transactions found for the specified year' });
    }

    const aggregatedData = {};
    MONTH_NAMES.forEach(month => {
      aggregatedData[month] = { income: 0, expense: 0, Net_Savings: 0 };
    });

    incomes.forEach(income => {
      if (income.date instanceof Date && !isNaN(income.date)) {
        const month = getMonthName(income.date);
        aggregatedData[month].income += income.amount;
      }
    });

    expenses.forEach(expense => {
      if (expense.date instanceof Date && !isNaN(expense.date)) {
        const month = getMonthName(expense.date);
        aggregatedData[month].expense += expense.amount;
      }
    });

    Object.keys(aggregatedData).forEach(month => {
      aggregatedData[month].Net_Savings = aggregatedData[month].income - aggregatedData[month].expense;
    });

    const formattedData = MONTH_NAMES.map(month => ({
      name: month,
      income: aggregatedData[month].income,
      expense: aggregatedData[month].expense,
      Net_Savings: aggregatedData[month].Net_Savings,
    }));

    res.status(201).json(formattedData);
  } catch (error) {
    // console.error('Error aggregating :', error); 
    res.status(500).json({ msg: 'Error aggregating ', error });
  }
};

exports.getAvailableYears = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: 'User not found in request' });
    }

    const getDistinctYears = async (Model) => {
      const dates = await Model.find({ user: req.user }).distinct('date');
      return dates.map(date => new Date(date).getFullYear());
    };

    const incomeYears = await getDistinctYears(Income);
    const expenseYears = await getDistinctYears(Expense);

    const combinedYears = Array.from(new Set([...incomeYears, ...expenseYears]));

    combinedYears.sort((b,a ) => a - b);

    

    if (combinedYears.length === 0) {
      return res.status(404).json({ msg: 'No transaction years found' });
    }

    res.status(200).json(combinedYears);
  } catch (error) {
    // console.error('Error fetching available years:', error); // Log the error for debugging
    res.status(500).json({ msg: 'Error fetching available years', error });
  }
};