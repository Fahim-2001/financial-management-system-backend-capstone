const prisma = require("../../../config/prisma.config");
const { generateTimestamp } = require("../../../utils/generativeFunctions");

class InvestmentTransactionServices {
    static async createTransaction(investmentId, data) {
        const currentDateTime = generateTimestamp();
        const investment = await prisma.investment.findUnique({
            where: { id: parseInt(investmentId) },
        });
        if (!investment) throw new Error("Investment not found");

        const transaction = await prisma.investmentTransaction.create({
            data: {
                investment_id: parseInt(investmentId),
                transaction_type: data.transaction_type,
                amount: parseInt(data.amount),
                date: data.date,
                notes: data.notes,
                created_at: currentDateTime,
                updated_at: currentDateTime,
            },
        });

        // Update current_value based on transaction type
        if (data.transaction_type === "Buy") {
            await prisma.investment.update({
                where: { id: parseInt(investmentId) },
                data: {
                    current_value:
                        parseInt(investment.current_value) +
                        parseInt(data.amount),
                    updated_at: currentDateTime,
                },
            });
        } else if (data.transaction_type === "Sell") {
            await prisma.investment.update({
                where: { id: parseInt(investmentId) },
                data: {
                    current_value:
                        parseInt(investment.current_value) -
                        parseInt(data.amount),
                    updated_at: currentDateTime,
                },
            });
        }

        return transaction;
    }

    static async deleteTransaction(investmentId, transactionId) {
        const currentDateTime = generateTimestamp();
        const transaction = await prisma.investmentTransaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction) throw new Error("Transaction not found");
        if (transaction.investment_id !== investmentId)
            throw new Error(
                "Transaction does not belong to the specified investment"
            );

        const investment = await prisma.investment.findUnique({
            where: { id: investmentId },
        });
        if (!investment) throw new Error("Investment not found");

        // Adjust current_value based on transaction type before deletion
        if (transaction.transaction_type === "Buy") {
            await prisma.investment.update({
                where: { id: investmentId },
                data: {
                    current_value:
                        investment.current_value - transaction.amount,
                    updated_at: currentDateTime,
                },
            });
        } else if (transaction.transaction_type === "Sell") {
            await prisma.investment.update({
                where: { id: investmentId },
                data: {
                    current_value:
                        investment.current_value + transaction.amount,
                    updated_at: currentDateTime,
                },
            });
        }

        return prisma.investmentTransaction.delete({
            where: { id: transactionId },
        });
    }
}

module.exports = InvestmentTransactionServices;
