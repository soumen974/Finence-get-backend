const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user}).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
   // console.error(err.message);
    res.status(500).send(`Server error ${err.message} `);
  }
};

exports.addExpense = async (req, res) => {
  const { amount, source, date , description , note} = req.body;

  try {
    const newExpense = new Expense({ user: req.user, amount, source, date, description, note });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    //console.error(err.message);
    //res.status(500).send('Server error');
    res.status(500).json({ error: `Error  : ${err.message}` });
  }
};