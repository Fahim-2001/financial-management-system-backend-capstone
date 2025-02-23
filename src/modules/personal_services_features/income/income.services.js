const prisma = require("../../../config/prisma.config");
const { findSmallestAvailableId } = require("../../../utils/findSmallestAvailableId");
const { generateTimestamp } = require("../../../utils/generativeFunctions");

exports.createIncome = async (data = Object) => {
    try {
        const missingId = await findSmallestAvailableId("income");
        const date = generateTimestamp();
        return await prisma.income.create({
            data: {
                id: missingId,
                amount: data?.amount,
                source: data?.source,
                category: data?.category,
                notes: data?.notes,
                date: date,
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
        return await prisma.income.findMany({});
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

exports.updateIncome = async (id, data) => {
    try {
        return await prisma.income.update({ where: { id }, data });
    } catch (error) {
        throw new Error(error);
    }
};

exports.deleteIncome = async (id = Number) => {
    try {
        return prisma.income.delete({ where: { id } });
    } catch (error) {
        throw new Error(error);
    }
};
