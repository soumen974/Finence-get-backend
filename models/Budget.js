const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  description: { type: String, required:true},
  note: { type: String}
});

module.exports = mongoose.model('Budget', BudgetSchema);