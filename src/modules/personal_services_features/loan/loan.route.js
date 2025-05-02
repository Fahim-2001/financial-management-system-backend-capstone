const express = require('express');
const router = express.Router();
const loanController = require('./loan.controller');

// Create a new loan
router.post('/', loanController.createLoan);

// Get all loans for a user
router.get('/user/:user_id', loanController.getAllLoans);

// Get a specific loan by ID
router.get('/:loanId', loanController.getLoanById);

// Make a payment towards a loan
router.post('/payment/:loan_id', loanController.makePayment);

// Delete a loan
router.delete('/:loan_id', loanController.deleteLoan);

module.exports = router;
