const prisma = require("../../../config/prisma.config");
const {
    findSmallestAvailableId,
} = require("../../../utils/findSmallestAvailableId");
const { generateTimestamp } = require("../../../utils/generativeFunctions");
const { convertDateFormat } = require("../../../utils/timestampToMS");

class IncomeService {
    static async createIncome(data = {}) {
        try {
            // Validate required fields
            if (!data.amount || !data.source || !data.category || !data.date || !data.user_id) {
                throw new Error("Missing required fields: amount, source, category, date, or user_id");
            }

            // Check if user_id exists
            const user = await prisma.user.findUnique({
                where: { id: parseInt(data.user_id) },
            });
            if (!user) {
                throw new Error(`User with ID ${data.user_id} does not exist`);
            }
            
            const missingId = await findSmallestAvailableId("income");
            const date = generateTimestamp();

            const userGivenDate = convertDateFormat(data.date);
            return await prisma.income.create({
                data: {
                    amount: parseFloat(data?.amount),
                    source: data?.source,
                    category: data?.category,
                    notes: data?.notes,
                    date: userGivenDate,
                    created_at: date,
                    updated_at: date,
                    user_id: parseInt(data?.user_id),
                },
            });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getIncomesFromDB(filters) {
        try {
            return await prisma.income.findMany({ orderBy: { date: "desc" } });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getAllIncomesByUserId(userId = Number, incomes = Array) {
        try {
            return incomes?.filter((income) => income?.user_id == userId);
        } catch (error) {
            throw new Error(error);
        }
    }

    static async getIncomeById(id) {
        try {
            return await prisma.income.findUnique({ where: { id } });
        } catch (error) {
            throw new Error(error);
        }
    }

    static async updateIncomeFromDB(id, data) {
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
    }

    static async deleteIncomeFromDB(id = Number) {
        try {
            return await prisma.income.delete({ where: { id } });
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = IncomeService;
