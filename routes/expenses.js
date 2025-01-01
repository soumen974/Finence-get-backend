const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getExpenses, addExpense } = require('../controllers/expenseController');

// Get all expenses
router.get('/', auth, getExpenses);

// Add a new expense
router.post('/', auth, addExpense);

module.exports = router;