const SavingsGoalService = require("./savingsGoals.services");

class SavingsGoalController {
    static async createGoal(req, res, next) {
        try {
            const data = req.body;
            const newGoal = await SavingsGoalService.createGoalIntoDB(data);

            res.status(201).json({
                success: true,
                message: "Savings goal created successfully",
                data: newGoal,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getGoalById(req, res, next) {
        try {
            const id = req?.params?.id;
            const goal = await SavingsGoalService.getGoalById(parseInt(id));
            return res.status(200).json(goal);
        } catch (error) {
            next(error);
        }
    }

    static async getGoalsOfAnUser(req, res, next) {
        try {
            const { id } = req?.params;
            const { end_date_order, status } = req?.query;

            let goals = await SavingsGoalService.getOneUsersGoals(parseInt(id));

            if (end_date_order) {
                goals = SavingsGoalService.sortGoalsByEndDate(
                    goals,
                    end_date_order
                );
            }

            if (status) {
                goals = SavingsGoalService.getGoalsByStatus(goals, status);
            }

            res.status(200).json({
                success: true,
                total: goals?.length,
                data: goals,
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateGoal(req, res, next) {
        try {
            const { id } = req.params;
            const { user_id } = req?.query;
            const data = req.body;

            const updatedGoal = await SavingsGoalService.updateGoalInfo(
                id,
                data
            );

            res.status(200).json({
                success: true,
                message: "Savings goal updated successfully",
                data: updatedGoal,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteGoal(req, res, next) {
        try {
            const { id } = req.params;

            await SavingsGoalService.deleteGoal(id);

            res.status(200).json({
                success: true,
                message: `Savings goal ${id} deleted successfully`,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = SavingsGoalController;
