const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { aggregateTransactionData ,getAvailableYears,getcategoryData } = require('../controllers/aggregatedTransactionController'); // Ensure the path is correct

// Define a route for POST requests to /LineChartData/:year
router.post('/LineChartData/:year', auth, aggregateTransactionData);
router.get('/availableYears', auth, getAvailableYears);
router.get('/categoryData/:year/:month', auth, getcategoryData);

module.exports = router;
