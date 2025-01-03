const { generateTimestamp } = require("../../../utils/generativeFunctions");
const prisma = require("../prismaClient");

exports.createExpenseIntoDB = async (data) => {
    try {
        const date = generateTimestamp();
        return prisma.expense.create({
            data: {
                title: data.title,
                amount: data.amount,
                category: data.category,
                date: date,
                createdAt: date,
                updatedAt: date,
                userId: data.userId,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getAllExpensesByUserFromDB = async (userId) => {
    try {
        return prisma.expense.findMany({
            where: { userId },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getExpenseByIdFromDB = async (id) => {
    try {
        return prisma.expense.findUnique({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};

exports.updateExpenseInDB = async (id, data) => {
    try {
        return prisma.expense.update({
            where: { id },
            data: {
                title: data.title,
                amount: data.amount,
                category: data.category,
                date: new Date(data.date),
                userId: data.userId,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.deleteExpenseFromDB = async (id) => {
    try {
        return prisma.expense.delete({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};
