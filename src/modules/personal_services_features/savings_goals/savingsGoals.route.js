const express = require("express");
const router = express.Router();
const savingsController = require("./savingsGoals.controller");

router.post("/", savingsController.createGoal);
router.get("/:userId", savingsController.getGoals);
router.patch("/:id", savingsController.updateGoal);
router.delete("/:id", savingsController.deleteGoal);

module.exports = router;
