const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user });
    res.json(budgets);
  } catch (err) {
    //console.error(err.message);
  //  res.status(500).send('Server error');
    res.status(500).json({ error: `Error : ${err.message}` });
  }
};

exports.addBudget = async (req, res) => {
  const { category, limit ,description ,note } = req.body;

  try {
    const newBudget = new Budget({ user: req.user, category, limit ,description, note });
    const budget = await newBudget.save();
    res.json(budget);
  } catch (err) {
    //console.error(err.message);
    //res.status(500).send('Server error');
    res.status(500).json({ error: `Error: ${err.message}` });
  }
};