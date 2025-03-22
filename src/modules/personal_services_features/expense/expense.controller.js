const cacheModule = require("../../../utils/cache");
const {
    filterDataByDaysRange,
    filterDataByMonth,
    filterDataByYear,
} = require("../../../utils/searchByQuery");
const expenseService = require("./expense.services");
const cacheKey = "expenses";

exports.createExpense = async (req, res, next) => {
    try {
        const userId = req?.body?.user_id;
        if (!userId)
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });

        const expense = await expenseService.createExpenseIntoDB(req?.body);

        cacheModule.deleteCachedData(cacheKey);
        return res.status(201).json({
            success: true,
            message: "Successfully entered a new expense entry",
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllExpenses = async (req, res, next) => {
    try {
        const userId = parseInt(req?.query?.user_id);
        const month = req?.query?.month;
        const year = req?.query?.year;
        const days = req?.query?.days;

        let expenses = cacheModule.getCachedData(cacheKey);
        if (!expenses) {
            expenses = await expenseService.getAllExpenses();
            cacheModule.setDataToCache(cacheKey, expenses);
        }

        if (userId) {
            expenses = await expenseService.getAllExpensesByUserId(
                userId,
                expenses
            );
        }

        if (days) {
            startDayInMs = Date.now() - Number(days) * 86400000; // 1 day = 86,400,000 milliseconds
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
};

exports.getExpenseById = async (req, res, next) => {
    try {
        const id = req?.params?.id;
        const expense = await expenseService.getExpenseByIdFromDB(parseInt(id));
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
};

exports.updateExpense = async (req, res, next) => {
    try {
        const userId = req?.body?.user_id;
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

        cacheModule.deleteCachedData(cacheKey);
        return res.status(200).json({
            success: true,
            message: "Expense data updated successfully.",
            data: updatedExpense,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const deleted = await expenseService.deleteExpenseFromDB(
            parseInt(req?.params?.id)
        );
        if (!deleted)
            return res
                .status(404)
                .json({ success: false, message: "Expense not found" });

        cacheModule.deleteCachedData(cacheKey);
        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
