const Income = require('../models/Income');

exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    //console.error(err.message);
   // res.status(500).send('Server error');
    res.status(500).json({ error: `Error : ${err.message}` });
  }
};

exports.getIncomeByid = async (req, res) => {
  try {
    const income = await Income.findOne({ user: req.user ,_id:req.params.id});
    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.json(income);
  } catch (err) {
    //console.error(err.message);
   // res.status(500).send('Server error');
    res.status(500).json({ error: `Error : ${err.message}` });
  }
};

exports.addIncome = async (req, res) => {
  const { amount, source, date,description,note } = req.body;

  try {
    const newIncome = new Income({ user: req.user, amount, source, date ,description,note});
    const income = await newIncome.save();
    res.json({mesg:'Added Successfully'});
  } catch (err) {
  //  console.error(err.message);
   // res.status(500).send('Server error');
    res.status(500).json({ error: `Error : ${err.message}` });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete({_id:req.params.id, user: req.user});
    if(!income) return res.status(404).json({error:'not found'});
    res.json({mesg:'Deleted Successfully '});
    
  } catch (err) {
    res.status(500).json({erorr:`Error : ${err.message}`});
  }
}

exports.updateIncome = async (req, res) => {
  try {
    const { amount, source, date, description, note } = req.body;

    if (!req.params.id || !req.user) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      {},
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ error: 'Income not found' });
    }

  
    if (amount !== undefined) income.amount = amount;
    if (source !== undefined) income.source = source;
    if (date !== undefined) income.date = date;
    if (description !== undefined) income.description = description;
    if (note !== undefined) income.note = note;

    
    await income.save();

    res.json({ msg: 'Updated Successfully' });
  } catch (err) {
    res.status(500).json({ error: `Error: ${err.message}` });
  }
};