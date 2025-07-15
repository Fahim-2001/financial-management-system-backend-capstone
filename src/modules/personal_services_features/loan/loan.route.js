const express = require("express");
const router = express.Router();
const LoanController = require("./loan.controller");

// Create a new loan
router.post("/", LoanController.createLoan);

// Get all loans for a user
router.get("/user/:user_id", LoanController.getAllLoans);

// Get a specific loan by ID
router.get("/:loanId", LoanController.getLoanById);

// Update a specific loan by ID
router.put("/:loan_id", LoanController.updateLoan);

// Get payments for a specific loan by loan_id
router.get("/:loan_id/payment", LoanController.getLoanPaymentsByLoanId);

// Delete a loan
router.delete("/:loan_id", LoanController.deleteLoan);

// Make a payment towards a loan
router.post("/:loan_id/payment", LoanController.makePayment);

// Delete a specific payment from a loan
router.delete('/:loan_id/payment/:payment_id', LoanController.deleteLoanPayment);

module.exports = router;