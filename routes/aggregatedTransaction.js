const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { aggregateTransactionData } = require('../controllers/aggregatedTransactionController');

router.get('/LineChartData', auth , aggregateTransactionData);

module.exports = router;