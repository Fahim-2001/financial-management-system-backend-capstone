const express = require('express');
const router = express.Router();
const InvestmentController = require('./investment.controller');
const InvestmentTransactionController = require('./investmentTransaction.controller');
const InvestmentPerformanceController = require('./investmentPerformance.controller');

router.post('', InvestmentController.createInvestment);
router.get('/:id', InvestmentController.getInvestmentById);
router.get('/user/:userId', InvestmentController.getUserInvestments);
router.put('/:id', InvestmentController.updateInvestment);
router.delete('/:id', InvestmentController.deleteInvestment);
router.post('/:id/transactions', InvestmentTransactionController.createTransaction);
router.delete('/:id/transactions/:transaction_id', InvestmentTransactionController.deleteTransaction);
router.post('/:id/performance', InvestmentPerformanceController.createInvestmentPerformance);
router.delete('/:id/performance/:performance_id', InvestmentPerformanceController.deleteInvestmentPerformance);
module.exports = router;