// loan.controller.js
const loanService = require("./loan.services");

const createLoan = async (req, res, next) => {
    try {
        const loan = await loanService.createLoan(req.body);
        return res.status(201).json({
            success: true,
            message: "Sucessfully added new loan entry",
            data: loan,
        });
    } catch (err) {
        next(err);
    }
};

const getAllLoans = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const loans = await loanService.getAllLoans(parseInt(user_id));
        return res
            .status(200)
            .json({ success: true, total: loans.length, data: loans });
    } catch (err) {
        next(err);
    }
};

const getLoanById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const loan = await loanService.getLoanById(parseInt(id));
        return res.status(200).json(loan);
    } catch (err) {
        next(err);
    }
};

const makePayment = async (req, res, next) => {
    try {
        const { loan_id } = req.params;
        const data = req.body;
        const updatedLoan = await loanService.makePayment(parseInt(loan_id), data);
        return res
            .status(201)
            .json({
                success: true,
                message: "Successfully added new loan payment",
                data: updatedLoan,
            });
    } catch (err) {
        next(err);
    }
};

const deleteLoan = async (req, res, next) => {
    try {
        const { loan_id } = req.params;
        await loanService.deleteLoan(parseInt(loan_id));
        return res.status(200).json({ message: "Loan deleted successfully" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createLoan,
    getAllLoans,
    getLoanById,
    makePayment,
    deleteLoan,
};
