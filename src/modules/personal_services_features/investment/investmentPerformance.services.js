const prisma = require("../../../config/prisma.config");
const { generateTimestamp } = require("../../../utils/generativeFunctions");

class InvestmentPerfomanceServices {
    static async createInvestmentPerformance(investment_id, data) {
        const currentDateTime = generateTimestamp();
        const { date, return_rate, value, notes } = data;

        const investment = await prisma.investment.findUnique({
            where: { id: parseInt(investment_id) },
        });
        if (!investment) throw new Error("Investment not found");

        return prisma.investmentPerformance.create({
            data: {
                investment_id: parseInt(investment_id),
                date,
                return_rate: parseFloat(return_rate),
                value: parseFloat(value),
                notes,
                created_at: currentDateTime,
                updated_at: currentDateTime,
            },
        });
    }

    static async deleteInvestmentPerformance(investment_id, performance_id) {
        const currentDateTime = generateTimestamp();
        const performance = await prisma.investmentPerformance.findUnique({
            where: { id: parseInt(performance_id) },
        });
        if (!performance) throw new Error("Performance record not found");
        if (performance.investment_id !== parseInt(investment_id))
            throw new Error(
                "Performance record does not belong to the specified investment"
            );

        return prisma.investmentPerformance.delete({
            where: { id: parseInt(performance_id) },
        });
    }
}

module.exports = InvestmentPerfomanceServices;
