const express = require("express");
const router = express.Router();
const SavingsGoalController = require("./savingsGoals.controller");
const GoalEntryController = require("./goal_entry/goalEntry.controller");

router
    .post("/", SavingsGoalController.createGoal)
    .get("/user/:id", SavingsGoalController.getGoalsOfAnUser);
router.get("/:id", SavingsGoalController.getGoalById);
router.put("/:id", SavingsGoalController.updateGoal);
router.delete("/:id", SavingsGoalController.deleteGoal);
router.post("/:goal_id/goal-entry", GoalEntryController.createGoalEntry);
router.get("/:goal_id/goal-entry", GoalEntryController.getAllGoalEntries);
router.get("/:goal_id/goal-entry/:id", GoalEntryController.getGoalEntryById);
router.put("/:goal_id/goal-entry/:id", GoalEntryController.updateGoalEntry);
router.delete("/:goal_id/goal-entry/:id", GoalEntryController.deleteGoalEntry);

module.exports = router;