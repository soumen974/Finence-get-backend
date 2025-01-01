const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBudgets, addBudget } = require('../controllers/budgetController');

// Get all budgets
router.get('/', auth, getBudgets);

// Add a new budget
router.post('/', auth, addBudget);

module.exports = router;