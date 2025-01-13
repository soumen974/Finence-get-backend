const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getExpenses, addExpense ,getExpenseByid,deleteExpense,updateExpense } = require('../controllers/expenseController');
const { route } = require('./income');

// Get all expenses
router.get('/', auth, getExpenses);

// Add a new expense
router.post('/', auth, addExpense);

// Get expense by id
router.get('/:id', auth, getExpenseByid);

// Delete expense
router.delete('/:id', auth, deleteExpense);

// Update expense
router.put('/:id', auth, updateExpense);



module.exports = router;