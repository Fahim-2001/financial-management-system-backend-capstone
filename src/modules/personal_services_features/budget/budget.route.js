const express = require("express");
const budgetRouter = express.Router();
const budgetController = require("./budget.controller");

budgetRouter.post("/", budgetController.createBudget);
budgetRouter.get("/user/:id", budgetController.getAllBudgets);
budgetRouter.get("/:id", budgetController.getBudgetById);
budgetRouter.put("/:id", budgetController.updateBudget);
budgetRouter.delete("/:id", budgetController.deleteBudget);

budgetRouter.post("/:id/sub-events", budgetController.addSubEvent);
budgetRouter.delete("/sub-events/:subId", budgetController.deleteSubEvent);

module.exports = budgetRouter;
