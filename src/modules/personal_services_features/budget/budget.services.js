const prisma = require("../../../config/prisma.config.js");
const cache = require("../../../utils/cache.js");
const { generateTimestamp } = require("../../../utils/generativeFunctions.js");
const { convertDateFormat } = require("../../../utils/timestampToMS.js");

exports.createBudget = async (data) => {
  const key = "all_budgets";
  const date = generateTimestamp();

  const newBudget = await prisma.budget.create({
    data: {
      title: data?.title || '',
      type: data?.type || 'Monthly', // Default to 'Monthly' if not provided
      start_date: convertDateFormat(data?.start_date) || date,
      end_date: convertDateFormat(data?.end_date), // Use null if invalid or missing
      total_amount: parseFloat(data?.total_amount) || 0,
      created_at: date,
      updated_at: date,
      remaining: parseFloat(data?.total_amount) || 0,
      user_id: parseInt(data?.user_id) || null,
    },
  });

  cache.deleteCachedData(key);
  return newBudget;
};

exports.getAllBudgetsOfAnUser = async (user_id = Number) => {
    const key = "all_budgets";
    if (cache.nodeCache.has(key)) return cache.getCachedData(key);

    let budgets = await prisma.budget.findMany({
        where: { user_id: user_id },
        include: { subEvents: true },
        orderBy: { id: "desc" },
    });

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
    const formattedDate = convertDateFormat(data?.end_date);
    const updatedBudget = await prisma.budget.update({
        where: { id },
        data: {
            title: data?.title,
            total_amount: data?.total_amount,
            remaining: data?.remaining,
            type: data?.type,
            end_date: formattedDate,
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

exports.getAllSubBudgets = async (budget_id = Number) => {
    console.log(budget_id)
    const subBudgets = await prisma.subBudget.findMany({
        where: { budget_id: budget_id },
        orderBy: { id: "desc" },
    });

    return subBudgets;
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
