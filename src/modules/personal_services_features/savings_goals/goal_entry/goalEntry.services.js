const prisma = require("../../../../config/prisma.config");
const { generateTimestamp } = require("../../../../utils/generativeFunctions");
const SavingsGoalService = require("../savingsGoals.services");

class GoalEntryService {
    static async createGoalEntry(data = {}, goal_id = Number) {
        try {
            const date = generateTimestamp();
            const result = await prisma.goalEntry.create({
                data: {
                    goal_id: parseInt(goal_id),
                    amount: parseFloat(data.amount),
                    entry_date: data.entry_date || date,
                    notes: data.notes,
                    created_at: date,
                    updated_at: date,
                },
            });

            await SavingsGoalService.updateGoalCurrentAmount(
                parseInt(goal_id),
                parseInt(data?.amount)
            );
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getAllGoalEntries(goal_id = Number) {
        try {
            console.log(goal_id);
            return await prisma.goalEntry.findMany({
                where: { goal_id: parseInt(goal_id) },
                orderBy: { entry_date: "desc" },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getGoalEntryById(id = Number) {
        try {
            return await prisma.goalEntry.findUnique({
                where: { id: parseInt(id) },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async updateGoalEntry(id = Number, data = {}) {
        try {
            const date = generateTimestamp();
            return await prisma.goalEntry.update({
                where: { id: parseInt(id) },
                data: {
                    amount: parseFloat(data.amount),
                    entry_date: data.entry_date || date,
                    updated_at: date,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async deleteGoalEntry(goal_id = Number, id = Number) {
        try {
            const entry = await prisma.goalEntry.findUnique({
                where: { id: parseInt(id) },
            });

            if (!entry) return new Error("No entry with this id found");

            await SavingsGoalService.updateGoalCurrentAmount(
                goal_id,
                -entry.amount
            );

            return await prisma.goalEntry.delete({
                where: { id: parseInt(id) },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = GoalEntryService;
