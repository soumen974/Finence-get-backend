const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getIncomes, addIncome ,deleteIncome, updateIncome} = require('../controllers/incomeController');

// Get all incomes
router.get('/', auth, getIncomes);

// Add a new income
router.post('/', auth, addIncome);

// Delete income

router.delete('/:id', auth, deleteIncome);

//updatr 
router.put('/:id', auth, updateIncome);

module.exports = router;