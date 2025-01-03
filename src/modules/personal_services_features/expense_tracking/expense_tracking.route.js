const express = require("express");
const expensesRouter = express.Router();
const expenseController = require("./expense_tracking.controller");

// CRUD routes
expensesRouter.post("/expenses", expenseController.createExpense);
expensesRouter.get("/expenses", expenseController.getAllExpenses);
expensesRouter.get("/expenses/:id", expenseController.getExpenseById);
expensesRouter.put("/expenses/:id", expenseController.updateExpense);
expensesRouter.delete("/expenses/:id", expenseController.deleteExpense);

module.exports = expensesRouter;
