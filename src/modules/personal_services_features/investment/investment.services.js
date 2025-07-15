const prisma = require("../../../config/prisma.config");
const { generateTimestamp } = require("../../../utils/generativeFunctions");

class InvestmentService {
    static async createInvestment(data) {
        const {
            user_id,
            title,
            investment_type,
            institution,
            initial_amount,
            start_date,
        } = data;
        const currentDateTime = generateTimestamp();

        // Validate user existence
        const user = await prisma.user.findUnique({
            where: { id: parseInt(user_id) },
        });
        if (!user) throw new Error(`User with id ${user_id} does not exist`);

        return prisma.investment.create({
            data: {
                title,
                investment_type,
                institution,
                initial_amount: parseFloat(initial_amount),
                current_value: parseFloat(initial_amount), // Assuming current value starts as initial amount
                start_date,
                status: "Active",
                notes: data.notes,
                user_id: parseInt(user_id),
                created_at: currentDateTime,
                updated_at: currentDateTime,
            },
        });
    }

    static async getInvestmentById(id) {
        const investment = await prisma.investment.findUnique({
            where: { id: parseInt(id) },
            include: { transactions: true, performance: true },
        });
        if (!investment) throw new Error("Investment not found");
        return investment;
    }

    static async getUserInvestments(userId) {
        return prisma.investment.findMany({
            where: { user_id: userId },
            include: { transactions: true },
        });
    }

    static async updateInvestment(id, data) {
        const currentDateTime = generateTimestamp();
        return prisma.investment.update({
            where: { id: parseInt(id) },
            data: { ...data, updated_at: currentDateTime },
        });
    }

    static async deleteInvestment(id) {
        return prisma.investment.delete({ where: { id } });
    }
}

module.exports = InvestmentService;
