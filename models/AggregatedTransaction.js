const mongoose = require('mongoose');
const { type } = require('os');

const AggregatedTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  incomePerMonth: { type: Number, required: true },
  expensePerMonth: { type: Number, required: true },
  netSavingsPerMonth: { type: Number, required: true }
});

module.exports = mongoose.model('AggregatedTransaction', AggregatedTransactionSchema);
