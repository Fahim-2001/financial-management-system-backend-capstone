const prisma = require("../../../config/prisma.config");

// Create new goal
exports.createGoal = async (data) => {
    return await prisma.savingsGoal.create({ data });
};

// Fetch user goals
exports.getGoals = async (userId) => {
    return await prisma.savingsGoal.findMany({
        where: { user_id: parseInt(userId) }
    });
};

// Update goal progress
exports.updateGoal = async (id, currentAmount) => {
    const goal = await prisma.savingsGoal.findUnique({ where: { id: parseInt(id) } });

    if (!goal) throw new Error("Goal not found");

    const newAmount = goal.currentAmount + currentAmount;
    const status = newAmount >= goal.targetAmount ? "Completed" : "In Progress";

    return await prisma.savingsGoal.update({
        where: { id: parseInt(id) },
        data: { currentAmount: newAmount, status }
    });
};

// Delete goal
exports.deleteGoal = async (id) => {
    return await prisma.savingsGoal.delete({ where: { id: parseInt(id) } });
};
