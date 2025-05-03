const savingsService = require("./savingsGoals.services");


// Create Savings Goal
exports.createGoal = async (req, res, next) => {
    try {
        const data = req.body;
        const newGoal = await savingsService.createGoalIntoDB(data);

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
exports.getGoalById = async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const goal = await savingsService.getGoalById(parseInt(id));
        return res.status(200).json(goal);
    } catch (error) {
        next(error);
    }
};
exports.getGoalsOfAnUser = async (req, res, next) => {
    try {
        const { user_id, end_date_order, status } = req?.query;

        let goals = await savingsService.getOneUsersGoals(user_id);

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
        const { user_id, is_amount } = req?.query;
        const data = req.body;

        let updatedGoal;

        // Update amount or info of a savings-goal
        if (Boolean(parseInt(is_amount))) {
            updatedGoal = await savingsService.updateGoalCurrentAmount(
                id,
                user_id,
                data?.current_amount
            );
        } else {
            updatedGoal = await savingsService.updateGoalInfo(
                id,
                user_id,
                data
            );
        }

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
            message: `Savings goal ${id} deleted successfully`,
        });
    } catch (err) {
        next(err);
    }
};
