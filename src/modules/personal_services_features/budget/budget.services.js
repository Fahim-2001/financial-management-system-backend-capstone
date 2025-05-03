const prisma = require("../../../config/prisma.config.js");
const cache = require("../../../utils/cache.js");
const { generateTimestamp } = require("../../../utils/generativeFunctions.js");

exports.createBudget = async (data) => {
    const key = "all_budgets";
    const date = generateTimestamp();
    const newBudget = await prisma.budget.create({
        data: {
            ...data,
            total_amount: parseFloat(data?.total_amount),
            created_at: date,
            updated_at: date,
            remaining: parseFloat(data?.total_amount),
            user_id: parseInt(data?.user_id)
        },
    });

    cache.deleteCachedData(key);
    return newBudget;
};

exports.getAllBudgetsOfAnUser = async (user_id = Number, type = String) => {
    const key = "all_budgets";
    if (cache.nodeCache.has(key)) return cache.getCachedData(key);

    let budgets;
    if (type) {
        budgets = await prisma.budget.findMany({
            where: { user_id: user_id, AND: [{ type: type }] },
            include: { subEvents: true },
            orderBy: { id: "asc" },
        });
    } else {
        budgets = await prisma.budget.findMany({
            where: { user_id: user_id },
            include: { subEvents: true },
            orderBy: { id: "asc" },
        });
    }

    cache.setDataToCache(key, budgets);
    return budgets;
};

exports.getBudgetById = async (id) => {
    const key = `budget_${id}`;
    if (cache.nodeCache.has(key)) return cache.getCachedData(key);

    const budget = await prisma.budget.findUnique({
        where: { id },
        include: { subEvents: true },
    });
    cache.setDataToCache(key, budget);
    return budget;
};

exports.updateBudget = async (id, data) => {
    const date = generateTimestamp();
    const updatedBudget = await prisma.budget.update({
        where: { id },
        data: {
            ...data,
            updated_at: date,
        },
    });
    cache.nodeCache.flushAll();
    return updatedBudget;
};

exports.deleteBudget = async (id) => {
    const deleteBudget = await prisma.budget.delete({
        where: { id: parseInt(id) },
    });
    cache.nodeCache.flushAll();
    return deleteBudget;
};

// Sub Events
exports.addSubEvent = async (budgetId, data) => {
    const date = generateTimestamp();
    const sub = await prisma.subBudget.create({
        data: {
            ...data,
            created_at: date,
            budget_id: budgetId,
        },
    });

    await prisma.budget.update({
        where: { id: budgetId },
        data: {
            remaining: {
                decrement: data.amount,
            },
        },
    });

    cache.nodeCache.flushAll();
    return sub;
};

exports.deleteSubEvent = async (subId) => {
    const sub = await prisma.subBudget.findUnique({ where: { id: subId } });

    // Restore the amount to budget
    await prisma.budget.update({
        where: { id: sub.budget_id },
        data: {
            remaining: {
                increment: sub.amount,
            },
        },
    });

    await prisma.subBudget.delete({ where: { id: subId } });
    cache.nodeCache.flushAll();
    return;
};
