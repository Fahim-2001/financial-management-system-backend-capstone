const express = require('express');
const router = express.Router();
const incomeController = require('./income.controller');

router.post('/', incomeController.createIncome);
router.get('/', incomeController.getAllIncomes);
router.get('/:id', incomeController.getIncomeById);
router.put('/:id', incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;