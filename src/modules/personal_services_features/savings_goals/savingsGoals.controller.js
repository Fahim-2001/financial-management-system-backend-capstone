const savingsService = require("./savingsGoals.services");

// Create Savings Goal
exports.createGoal = async (req, res, next) => {
    try {
        const { user_id, name, targetAmount, endDate } = req.body;
        const newGoal = await savingsService.createGoal({ user_id, name, targetAmount, endDate });

        res.status(201).json({
            success: true,
            message: "Savings goal created successfully",
            data: newGoal
        });
    } catch (err) {
        next(err);
    }
};

// Get User's Goals
exports.getGoals = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const goals = await savingsService.getGoals(userId);

        res.status(200).json({
            success: true,
            data: goals
        });
    } catch (err) {
        next(err);
    }
};

// Update Savings Progress
exports.updateGoal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentAmount } = req.body;

        const updatedGoal = await savingsService.updateGoal(id, currentAmount);

        res.status(200).json({
            success: true,
            message: "Savings goal updated successfully",
            data: updatedGoal
        });
    } catch (err) {
        next(err);
    }
};

// Delete Goal
exports.deleteGoal = async (req, res, next) => {
    try {
        const { id } = req.params;

        await savingsService.deleteGoal(id);

        res.status(200).json({
            success: true,
            message: "Savings goal deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};
