const expenseService = require("./expense_tracking.services");

exports.createExpense = async (req, res) => {
    try {
        const userId = req?.body?.userId;
        if (!userId)
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });

        const expense = await expenseService.createExpenseIntoDB(req?.body);
        return res.status(201).json({
            success: true,
            message: "Successfully entered a new expense entry",
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const userId = parseInt(req.query.userId);
        if (!userId)
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });

        const expenses = await expenseService.getAllExpensesByUserFromDB(
            userId
        );
        return res.status(200).json({
            success: true,
            total: expenses?.length,
            data: expenses,
        });
    } catch (error) {
        next(error);
    }
};

exports.getExpenseById = async (req, res) => {
    try {
        const id = req?.params?.id;
        const expense = await expenseService.getExpenseByIdFromDB(parseInt(id));
        if (!expense)
            return res
                .status(404)
                .json({ success: false, message: "Expense not found" });
        return res.status(200).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const userId = req?.body?.userId;
        if (!userId)
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });

        const updatedExpense = await expenseService.updateExpenseInDB(
            parseInt(req?.params?.id),
            { ...req?.body, userId }
        );
        if (!updatedExpense)
            return res
                .status(404)
                .json({ success: false, message: "Expense not found" });

        return res.status(200).json({
            success: true,
            message: "Expense data updated successfully.",
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const deleted = await expenseService.deleteExpenseFromDB(
            parseInt(req?.params?.id)
        );
        if (!deleted)
            return res
                .status(404)
                .json({ success: false, message: "Expense not found" });
        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
