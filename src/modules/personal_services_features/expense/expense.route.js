const express = require("express");
const expensesRouter = express.Router();
const expenseController = require("./expense.controller");

// CRUD routes
expensesRouter.post("/", expenseController.createExpense);
expensesRouter.get("/", expenseController.getAllExpenses);
expensesRouter.get("/:id", expenseController.getExpenseById);
expensesRouter.put("/:id", expenseController.updateExpense);
expensesRouter.delete("/:id", expenseController.deleteExpense);

module.exports = expensesRouter;
