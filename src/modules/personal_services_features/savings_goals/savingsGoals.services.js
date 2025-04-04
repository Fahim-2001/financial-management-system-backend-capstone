const prisma = require("../../../config/prisma.config");
const {
    findSmallestAvailableId,
} = require("../../../utils/findSmallestAvailableId");
const { generateTimestamp } = require("../../../utils/generativeFunctions");

// Create new goal
exports.createGoalIntoDB = async (data = Object) => {
    try {
        const missingId = await findSmallestAvailableId("savingsGoal");
        const date = generateTimestamp();

        return await prisma.savingsGoal.create({
            data: {
                id: missingId,
                title: data?.title,
                target_amount: data?.target_amount,
                current_amount: data?.current_amount,
                start_date: data?.start_date,
                end_date: data?.end_date,
                created_at: date,
                updated_at: date,
                user_id: data?.user_id,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

// Fetch user goals
exports.getOneUsersGoalsByNearestEndDate = async (user_id = Number) => {
    try {
        let data = await prisma.savingsGoal.findMany({
            where: { user_id: parseInt(user_id) },
        });
        return data;
    } catch (error) {
        throw new Error(error);
    }
};

exports.sortGoalsByEndDate = (goals, order = "asc") => {
    return goals.sort((a, b) => {
        const dateA = new Date(a.end_date);
        const dateB = new Date(b.end_date);
        
        if (order === "asc") {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
};

exports.getGoalsByStatus = (goals, status = "In Progress") => {
    return goals.filter(
        (goal) => goal.status.toLowerCase() === status.toLowerCase()
    );
};

// Update goal progress
exports.updateGoal = async (id, currentAmount) => {
    try {
        const goal = await prisma.savingsGoal.findUnique({
            where: { id: parseInt(id) },
        });

        if (!goal) throw new Error("Goal not found");

        const newAmount = goal.currentAmount + currentAmount;
        const status =
            newAmount >= goal.targetAmount ? "Completed" : "In Progress";

        return await prisma.savingsGoal.update({
            where: { id: parseInt(id) },
            data: { currentAmount: newAmount, status },
        });
    } catch (error) {
        throw new Error(error);
    }
};

// Delete goal
exports.deleteGoal = async (id) => {
    try {
        return await prisma.savingsGoal.delete({ where: { id: parseInt(id) } });
    } catch (error) {
        throw new Error(error);
    }
};
