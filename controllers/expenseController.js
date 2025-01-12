const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user}).sort({ date: -1 , _id: -1 });
    res.json(expenses);
  } catch (err) {
    // console.error(err.message);
    res.status(500).send(`Server error ${err.message}`);
  }
};

exports.getExpenseByid = async (req, res) => {
  try {
    const expense = await Expense.findOne({ user: req.user ,_id:req.params.id});
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    //console.error(err.message);
    //res.status(500).send('Server error');
    res.status(500).json({ error: `Error : ${err.message}` });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete({_id:req.params.id, user: req.user});
    if(!expense) return res.status(404).json({error:'not found'});
    res.json({mesg:'Deleted Successfully '});

  } catch (err) {
    res.status(500).json({erorr:`Error : ${err.message}`});
  }
};

exports.updateExpense = async (req, res) => {
  const { amount, source, date , description , note} = req.body;
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { amount, source, date , description , note},
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    //console.error(err.message);
    //res.status(500).send('Server error');
    res.status(500).json({ error: `Error : ${err.message}` });
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