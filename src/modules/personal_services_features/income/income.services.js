const prisma = require("../../../config/prisma.config");
const {
    findSmallestAvailableId,
} = require("../../../utils/findSmallestAvailableId");
const { generateTimestamp } = require("../../../utils/generativeFunctions");
const { convertDateFormat } = require("../../../utils/timestampToMS");

exports.createIncome = async (data = Object) => {
    try {
        const missingId = await findSmallestAvailableId("income");
        const date = generateTimestamp();
        const userGivenDate = convertDateFormat(data.date);
        return await prisma.income.create({
            data: {
                id: missingId,
                amount: parseFloat(data?.amount),
                source: data?.source,
                category: data?.category,
                notes: data?.notes,
                date: userGivenDate,
                created_at: date,
                updated_at: date,
                user_id: data?.user_id,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getIncomesFromDB = async (filters) => {
    try {
        return await prisma.income.findMany({ orderBy: { date: "desc" } });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getAllIncomesByUserId = async (userId = Number, incomes = Array) => {
    try {
        return incomes?.filter((income) => {
            return income?.user_id == userId;
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.getIncomeById = async (id) => {
    try {
        return await prisma.income.findUnique({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};

exports.updateIncomeFromDB = async (id, data) => {
    try {
        const date = generateTimestamp();
        data.updated_at = date;
        const userGivenDate = convertDateFormat(data.date);
        return await prisma.income.update({
            where: { id },
            data: {
                source: data?.source,
                amount: parseFloat(data?.amount),
                category: data?.category,
                notes: data?.notes,
                date: userGivenDate,
                updated_at: date,
                user_id: data?.user_id,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

exports.deleteIncomeFromDB = async (id = Number) => {
    try {
        return await prisma.income.delete({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};
