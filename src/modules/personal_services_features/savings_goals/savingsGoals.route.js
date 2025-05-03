const express = require("express");
const router = express.Router();
const savingsController = require("./savingsGoals.controller");
const goalEntryController = require("./goal_entry/goalEntry.controller");

router
    .post("/", savingsController.createGoal)
    .get("/", savingsController.getGoalsOfAnUser);
router.get("/:id", savingsController.getGoalById);
router.put("/:id", savingsController.updateGoal);
router.delete("/:id", savingsController.deleteGoal);
router.post("/goal-entry/:goal_id", goalEntryController.createGoalEntry);
router.get("/goal-entry", goalEntryController.getAllGoalEntries);
router.get("/goal-entry/:id", goalEntryController.getGoalEntryById);
router.put("/goal-entry/:id", goalEntryController.updateGoalEntry);
router.delete("/goal-entry/:id", goalEntryController.deleteGoalEntry);

module.exports = router;
