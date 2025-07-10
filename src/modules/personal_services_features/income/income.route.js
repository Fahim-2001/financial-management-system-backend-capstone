const express = require('express');
const router = express.Router();
const IncomeController = require('./income.controller');

router.post('/', IncomeController.createIncome);
router.get('/user/:id', IncomeController.getAllIncomes);
router.get('/:id', IncomeController.getIncomeById);
router.put('/:id', IncomeController.updateIncome);
router.delete('/:id', IncomeController.deleteIncome);

module.exports = router;