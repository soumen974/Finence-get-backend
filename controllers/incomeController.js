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
  try{
    const { amount, source, date , description ,note} = req.body;
    let income = await Income.findByIdAndUpdate({_id:req.params.id, user:req.user});
    if(!income) return res.status(404).json({error:'not found'});

    if(amount) amount = income.amount;
    if(source) source = income.source;
    if(date) date = income.date;
    if(description) description = income.description;
    if(note) note = income.note;
    await income.save();
    
    res.json({mesg:'Updated Successfully'});
    
  }catch(err){
    res.status(500).json({error :`Error : ${err.message}`})
  }
}