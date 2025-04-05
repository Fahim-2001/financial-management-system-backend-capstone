const prisma = require("../../../config/prisma.config");
const { generateTimestamp } = require("../../../utils/generativeFunctions");

// Create new goal
exports.createGoalIntoDB = async (data = Object) => {
    try {
        const date = generateTimestamp();

        return await prisma.savingsGoal.create({
            data: {
                title: data?.title,
                target_amount: data?.target_amount,
                current_amount: data?.current_amount,
                start_date: data?.start_date,
                end_date: data?.end_date,
                goal: data?.goal,
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
exports.getGoalById = async (id = Number) => {
    try {
        return await prisma.savingsGoal.findUnique({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getOneUsersGoals = async (user_id = Number) => {
    try {
        let data = await prisma.savingsGoal.findMany({
            where: { user_id: parseInt(user_id) },
            orderBy: { id: "asc" },
        });
        return data;
    } catch (error) {
        throw new Error(error);
    }
};

exports.sortGoalsByEndDate = (goals, order = "asc") => {
    return goals.sort((a, b) => {
        const dateA = a.end_date ? new Date(a.end_date) : null;
        const dateB = b.end_date ? new Date(b.end_date) : null;

        // If both dates are null or undefined
        if (!dateA && !dateB) return 0;

        // If only dateA is null, place it after
        if (!dateA) return 1;

        // If only dateB is null, place it after
        if (!dateB) return -1;

        // Normal comparison if both dates exist
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
exports.updateGoalCurrentAmount = async (
    id = Number,
    user_id = Number,
    current_amount = Number
) => {
    try {
        const goal = await prisma.savingsGoal.findUnique({
            where: {
                id: parseInt(id),
                AND: [ { user_id: parseInt(user_id) }],
            },
        });

        if (!goal) throw new Error("Goal not found");
        
        const newAmount = goal.current_amount + current_amount;
        const status =
            newAmount >= goal.target_amount ? "Completed" : "In Progress";

        return await prisma.savingsGoal.update({
            where: {
                id: parseInt(id),
                AND: [{ user_id: parseInt(user_id) }],
            },
            data: { current_amount: newAmount, status: status },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.updateGoalInfo = async (
    id = Number,
    user_id = Number,
    data = Object
) => {
    try {
        const goal = await prisma.savingsGoal.findUnique({
            where: {
                id: parseInt(id),
                AND: [ { user_id: parseInt(user_id) }],
            },
        });

        if (!goal) throw new Error("Goal not found");

        const date = generateTimestamp();
        return await prisma.savingsGoal.update({
            where: {
                id: parseInt(id),
                AND: [ { user_id: parseInt(user_id) }],
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
};

// Delete goal
exports.deleteGoal = async (id) => {
    try {
        return await prisma.savingsGoal.delete({ where: { id: parseInt(id) } });
    } catch (error) {
        throw new Error(error);
    }
};
