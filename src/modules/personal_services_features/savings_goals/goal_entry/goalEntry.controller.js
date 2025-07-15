const GoalEntryService = require("./goalEntry.services");

class GoalEntryController {
    static async createGoalEntry(req, res, next) {
        try {
            const { goal_id } = req?.params;
            const data = req.body;
            const newEntry = await GoalEntryService.createGoalEntry(
                data,
                goal_id
            );
            return res.status(201).json({
                success: true,
                message: `Added new entry for ${goal_id} no Savings`,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllGoalEntries(req, res, next) {
        try {
            const { goal_id } = req?.params;
            console.log(goal_id);
            const entries = await GoalEntryService.getAllGoalEntries(
                parseInt(goal_id)
            );
            res.status(200).json(entries);
        } catch (err) {
            next(err);
        }
    }

    static async getGoalEntryById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const entry = await GoalEntryService.getGoalEntryById(id);
            res.status(200).json(entry);
        } catch (err) {
            next(err);
        }
    }

    static async updateGoalEntry(req, res, next) {
        try {
            const { goal_id, id } = req?.params;
            const data = req.body;
            const updated = await GoalEntryService.updateGoalEntry(id, data);
            res.status(200).json({
                success: true,
                message: `No. ${id} entry of ${goal_id} updated successfully!`,
                data: updated,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteGoalEntry(req, res, next) {
        try {
            const { goal_id, id } = req?.params;
            console.log(goal_id, id);
            const deleted = await GoalEntryService.deleteGoalEntry(goal_id, id);
            res.status(200).json({
                success: true,
                message: `No ${id} entry of No. ${goal_id} deleted successfully!`,
                data: deleted,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = GoalEntryController;
