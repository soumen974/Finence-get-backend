const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getIncomes , getIncomeByid , addIncome ,deleteIncome, updateIncome} = require('../controllers/incomeController');

// Get all incomes
router.get('/', auth, getIncomes);

// get income by id

router.get('/:id', auth, getIncomeByid);

// Add a new income
router.post('/', auth, addIncome);

// Delete income

router.delete('/:id', auth, deleteIncome);

//updatr 
router.put('/:id', auth, updateIncome);

module.exports = router;