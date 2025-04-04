const express = require("express");
const router = express.Router();
const savingsController = require("./savingsGoals.controller");

router
    .post("/", savingsController.createGoal)
    .get("/", savingsController.getGoalsOfAnUser);
router.get("/:id", savingsController.getGoalById);
router.put("/:id", savingsController.updateGoal);
router.delete("/:id", savingsController.deleteGoal);

module.exports = router;
