const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required:true},
  note: { type: String}
});

module.exports = mongoose.model('Income', IncomeSchema);