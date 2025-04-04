const {
    deleteCachedData,
    getCachedData,
    setDataToCache,
} = require("../../../utils/cache");
const savingsService = require("./savingsGoals.services");
const cacheKey = "savingsGoals";

// Create Savings Goal
exports.createGoal = async (req, res, next) => {
    try {
        const data = req.body;
        const newGoal = await savingsService.createGoalIntoDB(data);

        deleteCachedData(cacheKey);
        res.status(201).json({
            success: true,
            message: "Savings goal created successfully",
            data: newGoal,
        });
    } catch (err) {
        next(err);
    }
};

// Get User's Goals
exports.getGoals = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { end_date_order, status } = req?.query;

        let goals = getCachedData(cacheKey);

        if (!goals) {
            goals = await savingsService.getOneUsersGoalsByNearestEndDate(
                user_id
            );
            setDataToCache(cacheKey, goals);
        }

        if (end_date_order) {
            goals = savingsService.sortGoalsByEndDate(goals, end_date_order);
        }

        if (status) {
            goals = savingsService.getGoalsByStatus(goals, status);
        }

        // deleteCachedData(cacheKey);
        res.status(200).json({
            success: true,
            total: goals?.length,
            data: goals,
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
            data: updatedGoal,
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
            message: "Savings goal deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
