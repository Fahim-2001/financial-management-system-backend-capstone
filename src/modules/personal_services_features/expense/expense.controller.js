const cacheModule = require("../../../utils/cache");
const {
    filterDataByDaysRange,
    filterDataByMonth,
    filterDataByYear,
} = require("../../../utils/searchByQuery");
const ExpenseService = require("./expense.services");
const cacheKey = "expenses";

class ExpenseController {
    static async createExpense(req, res, next) {
        try {
            const userId = req?.body?.user_id;
            if (!userId)
                return res
                    .status(400)
                    .json({ success: false, message: "User ID is required" });

            const expense = await ExpenseService.createExpenseIntoDB(req?.body);

            return res.status(201).json({
                success: true,
                message: "Successfully entered a new expense entry",
                data: expense,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllExpenses(req, res, next) {
        try {
            const userId = parseInt(req?.params?.id);
            const month = req?.query?.month;
            const year = req?.query?.year;
            const days = req?.query?.days;

            let expenses = await ExpenseService.getAllExpenses();

            if (userId) {
                expenses = await ExpenseService.getAllExpensesByUserId(
                    userId,
                    expenses
                );
            }

            if (days) {
                const startDayInMs = Date.now() - Number(days) * 86400000; // 1 day = 86,400,000 milliseconds
                expenses = filterDataByDaysRange(
                    expenses,
                    "date",
                    startDayInMs,
                    Date.now()
                );
            } else if (month && year) {
                expenses = filterDataByMonth(expenses, month, year);
            } else if (year) {
                expenses = filterDataByYear(expenses, year);
            }

            return res.status(200).json({
                success: true,
                total: expenses?.length,
                data: expenses,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExpenseById(req, res, next) {
        try {
            const id = req?.params?.id;
            const expense = await ExpenseService.getExpenseByIdFromDB(parseInt(id));
            if (!expense)
                return res.status(404).json({
                    success: false,
                    message: "Expense not found",
                });
            return res.status(200).json({
                success: true,
                data: expense,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateExpense(req, res, next) {
        try {
            const userId = req?.body?.user_id;
            if (!userId)
                return res
                    .status(400)
                    .json({ success: false, message: "User ID is required" });

            const updatedExpense = await ExpenseService.updateExpenseInDB(
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
                data: updatedExpense,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteExpense(req, res, next) {
        try {
            const deleted = await ExpenseService.deleteExpenseFromDB(
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
    }
}

module.exports = ExpenseController;