const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { aggregateTransactionData ,getAvailableYears,getcategoryData,getAvailableMonthsForCategoryData } = require('../controllers/aggregatedTransactionController'); // Ensure the path is correct

// Define a route for POST requests to /LineChartData/:year
router.post('/LineChartData/:year', auth, aggregateTransactionData);
router.get('/availableYears', auth, getAvailableYears);
router.get('/categoryData/:year/:month', auth, getcategoryData);
router.get('/availableMonths/:year', auth, getAvailableMonthsForCategoryData);

module.exports = router;
