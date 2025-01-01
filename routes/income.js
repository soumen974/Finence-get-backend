const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getIncomes, addIncome } = require('../controllers/incomeController');

// Get all incomes
router.get('/', auth, getIncomes);

// Add a new income
router.post('/', auth, addIncome);

module.exports = router;