const prisma = require("../../../../config/prisma.config");
const { generateTimestamp } = require("../../../../utils/generativeFunctions");

// Update parent's current_amount
exports.updateGoalCurrentAmount = async (goalId) => {
    const total = await prisma.goalEntry.aggregate({
        where: { goal_id: goalId },
        _sum: { amount: true },
    });

    const sumAmount = total._sum.amount || 0;

    await prisma.savingsGoal.update({
        where: { id: goalId },
        data: { current_amount: sumAmount},

    });

    const goal = await prisma.savingsGoal.findUnique({
        where: { id: parseInt(goalId) },
    });

    let status;
    if(goal.current_amount === goal.target_amount) status = "Completed";
    else if (goal.current_amount < goal.target_amount) status = "In Progress";

    await prisma.savingsGoal.update({
        where: { id: goalId },
        data: {  status:  status },

    });

};

// Create
exports.createGoalEntry = async (data, goal_id) => {
    const goal = await prisma.savingsGoal.findUnique({
        where: { id: parseInt(goal_id) },
    });

    const date = generateTimestamp();
    const entry = await prisma.goalEntry.create({
        data: {
            amount: parseFloat(data?.amount),
            current_amount:
                parseFloat(goal.current_amount) + parseFloat(data?.amount),
            entry_date: data?.entry_date,
            created_at: date,
            updated_at: date,
            goal_id: parseInt(goal_id),
        },
    });

    if (entry.goal_id) {
        await this.updateGoalCurrentAmount(entry.goal_id);
    }

    return entry;
};

// Read (All)
exports.getAllGoalEntries = async (goalId) => {
    const whereClause = goalId ? { goal_id: parseInt(goalId) } : {};

    return await prisma.goalEntry.findMany({ where: whereClause });
};

// Read (By ID)
exports.getGoalEntryById = async (id) => {
    return await prisma.goalEntry.findUnique({
        where: { id },
    });
};

// Update
exports.updateGoalEntry = async (id, data) => {
    const entry = await prisma.goalEntry.update({
        where: { id },
        data,
    });

    if (entry.goal_id) {
        await updateGoalCurrentAmount(entry.goal_id);
    }

    return entry;
};

// Delete
exports.deleteGoalEntry = async (id) => {
    const entry = await prisma.goalEntry.findUnique({ where: { id } });
    const deleted = await prisma.goalEntry.delete({ where: { id } });

    if (entry?.goal_id) {
        await updateGoalCurrentAmount(entry.goal_id);
    }

    return deleted;
};
