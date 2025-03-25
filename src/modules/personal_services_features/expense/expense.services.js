const { generateTimestamp } = require("../../../utils/generativeFunctions");
const {
    timestampToMilliseconds,
    convertDateFormat,
} = require("../../../utils/timestampToMS");
const {
    findSmallestAvailableId,
} = require("../../../utils/findSmallestAvailableId");
const prisma = require("../../../config/prisma.config");
exports.createExpenseIntoDB = async (data = Object) => {
    try {
        const missingId = await findSmallestAvailableId("expense");
        const date = generateTimestamp();
        const userGivenDate = convertDateFormat(data.date);
        return prisma.expense.create({
            data: {
                id: missingId,
                title: data.title,
                amount: parseFloat(data.amount),
                category: data.category,
                date: userGivenDate,
                created_at: date,
                updated_at: date,
                user_id: data.user_id,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getAllExpenses = async () => {
    try {
        return await prisma.expense.findMany({
            orderBy: { date: "desc" },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getAllExpensesByUserId = async (userId = Number, expenses = Array) => {
    try {
        const data = expenses?.filter((expense) => {
            return expense?.user_id == userId;
        });
        return data;
    } catch (error) {
        throw new Error(error);
    }
};

exports.getExpenseByIdFromDB = async (id = Number) => {
    try {
        return prisma.expense.findUnique({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};

exports.updateExpenseInDB = async (id = Number, data = Object) => {
    try {
        const date = generateTimestamp();
        const userGivenDate = convertDateFormat(data.date);
        return prisma.expense.update({
            where: { id },
            data: {
                title: data.title,
                amount: parseFloat(data.amount),
                category: data.category,
                date: userGivenDate,
                updated_at: date,
                user_id: data.user_id,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.deleteExpenseFromDB = async (id = Number) => {
    try {
        return prisma.expense.delete({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};
