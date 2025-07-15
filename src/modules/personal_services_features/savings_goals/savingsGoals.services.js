const prisma = require("../../../config/prisma.config");
const { generateTimestamp } = require("../../../utils/generativeFunctions");

class SavingsGoalService {
    static async createGoalIntoDB(data = {}) {
        try {
            const date = generateTimestamp();

            return await prisma.savingsGoal.create({
                data: {
                    title: data?.title,
                    target_amount: parseFloat(data?.target_amount),
                    current_amount: parseFloat(data?.current_amount),
                    start_date: data?.start_date,
                    end_date: data?.end_date,
                    goal: data?.goal,
                    created_at: date,
                    updated_at: date,
                    user_id: parseInt(data?.user_id),
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getGoalById(id = Number) {
        try {
            return await prisma.savingsGoal.findUnique({
                where: { id },
                include: { goal_entries: true },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getOneUsersGoals(user_id) {
        try {
            let data = await prisma.savingsGoal.findMany({
                where: { user_id },
                orderBy: { id: "desc" },
                include: { goal_entries: true },
            });
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }

    static sortGoalsByEndDate(goals, order = "asc") {
        return goals.sort((a, b) => {
            const dateA = a.end_date ? new Date(a.end_date) : null;
            const dateB = b.end_date ? new Date(b.end_date) : null;

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return order === "asc" ? dateA - dateB : dateB - dateA;
        });
    }

    static getGoalsByStatus(goals, status = "In Progress") {
        return goals.filter(
            (goal) => goal.status.toLowerCase() === status.toLowerCase()
        );
    }

    static async updateGoalCurrentAmount(id = Number, current_amount = Number) {
        try {
            const goal = await prisma.savingsGoal.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!goal) throw new Error("Goal not found");

            const newAmount = goal.current_amount + current_amount;
            const status =
                newAmount >= goal.target_amount ? "Completed" : "In Progress";
            
            return await prisma.savingsGoal.update({
                where: {
                    id: parseInt(id),
                },
                data: { current_amount: newAmount, status: status },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async updateGoalInfo(id = Number, data = {}) {
        try {
            const goal = await prisma.savingsGoal.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!goal) throw new Error("Goal not found");

            const date = generateTimestamp();
            return await prisma.savingsGoal.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    title: data?.title,
                    target_amount: data?.target_amount,
                    start_date: data?.start_date,
                    end_date: data?.end_date,
                    goal: data?.goal,
                    updated_at: date,
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async deleteGoal(id) {
        try {
            return await prisma.savingsGoal.delete({
                where: { id: parseInt(id) },
            });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = SavingsGoalService;
