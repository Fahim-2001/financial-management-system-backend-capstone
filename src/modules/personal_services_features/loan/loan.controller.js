const LoanService = require("./loan.services");

class LoanController {
    static async createLoan(req, res, next) {
        try {
            const loan = await LoanService.createLoanInDB(req.body);
            return res.status(201).json({
                success: true,
                message: "Successfully added new loan entry",
                data: loan,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllLoans(req, res, next) {
        try {
            const { user_id } = req.params;
            const loans = await LoanService.getAllLoans(parseInt(user_id));
            return res
                .status(200)
                .json({ success: true, total: loans.length, data: loans });
        } catch (err) {
            next(err);
        }
    }

    static async getLoanById(req, res, next) {
        try {
            const { loanId } = req.params;
            const loan = await LoanService.getLoanById(parseInt(loanId));
            return res.status(200).json(loan);
        } catch (err) {
            next(err);
        }
    }

    static async deleteLoan(req, res, next) {
        try {
            const { loan_id } = req.params;
            await LoanService.deleteLoan(parseInt(loan_id));
            return res
                .status(200)
                .json({ message: "Loan deleted successfully" });
        } catch (err) {
            next(err);
        }
    }

    static async makePayment(req, res, next) {
        try {
            const { loan_id } = req.params;
            const data = req.body;
            const updatedLoan = await LoanService.makePayment(
                parseInt(loan_id),
                data
            );
            return res.status(201).json({
                success: true,
                message: "Successfully added new loan payment",
                data: updatedLoan,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteLoanPayment(req, res, next) {
        try {
            const { loan_id, payment_id } = req.params;
            const result = await LoanService.deleteLoanPayment(
                parseInt(loan_id),
                parseInt(payment_id)
            );
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = LoanController;
