const InvestmentTransactionServices = require("./investmentTransaction.services");

class InvestmentTransactionController {
    static async createTransaction(req, res, next) {
        try {
            const transaction = await InvestmentTransactionServices.createTransaction(
                parseInt(req.params.id),
                req.body
            );
            return res.status(201).json({
                success: true,
                message: "Transaction created successfully",
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteTransaction(req, res, next) {
        try {
            const { id, transaction_id } = req.params;
            await InvestmentTransactionServices.deleteTransaction(
                parseInt(id),
                parseInt(transaction_id)
            );
            return res.status(200).json({
                success: true,
                message: "Transaction deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = InvestmentTransactionController;