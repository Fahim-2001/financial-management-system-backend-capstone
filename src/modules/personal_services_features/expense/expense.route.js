const express = require("express");
const ExpenseController = require("./expense.controller");
const expensesRouter = express.Router();

// CRUD routes
expensesRouter.post("/", ExpenseController.createExpense);
expensesRouter.get("/user/:id", ExpenseController.getAllExpenses);
expensesRouter.get("/:id", ExpenseController.getExpenseById);
expensesRouter.put("/:id", ExpenseController.updateExpense);
expensesRouter.delete("/:id", ExpenseController.deleteExpense);

module.exports = expensesRouter;