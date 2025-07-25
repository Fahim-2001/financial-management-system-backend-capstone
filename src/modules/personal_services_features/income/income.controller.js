const cacheModule = require("../../../utils/cache");
const {
    filterDataByDaysRange,
    filterDataByMonth,
    filterDataByYear,
} = require("../../../utils/searchByQuery");
const IncomeService = require("./income.services");
const cacheKey = "incomes";

class IncomeController {
    static async createIncome(req, res, next) {
        try {
            const userId = req?.body?.user_id;
            if (!userId)
                return res
                    .status(400)
                    .json({ success: false, message: "User ID is required" });

            const income = await IncomeService.createIncome(req.body);

            return res.status(201).json({
                success: true,
                message: "Successfully entered a new income entry",
                data: income,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getAllIncomes(req, res, next) {
        try {
            const userId = parseInt(req?.params?.id);
            const month = req?.query?.month;
            const year = req?.query?.year;
            const days = req?.query?.days;

            let incomes = await IncomeService.getIncomesFromDB();

            if (userId) {
                incomes = await IncomeService.getAllIncomesByUserId(userId, incomes);
            }

            if (days) {
                const startDayInMs = Date.now() - Number(days) * 86400000; // 1 day = 86,400,000 milliseconds
                incomes = filterDataByDaysRange(incomes, "date", startDayInMs, Date.now());
            } else if (month && year) {
                incomes = filterDataByMonth(incomes, month, year);
            } else if (year) {
                incomes = filterDataByYear(incomes, year);
            }

            return res.status(200).json({
                success: true,
                total: incomes.length,
                data: incomes,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getIncomeById(req, res, next) {
        try {
            const income = await IncomeService.getIncomeById(Number(req.params.id));
            res.status(200).json(income);
        } catch (err) {
            next(err);
        }
    }

    static async updateIncome(req, res, next) {
        try {
            const incomeId = parseInt(req?.params?.id);
            const income = await IncomeService.updateIncomeFromDB(incomeId, req?.body);

            return res.status(200).json({
                success: true,
                message: `Successfully updated income entry ${incomeId}`,
                data: income,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteIncome(req, res, next) {
        try {
            const incomeId = parseInt(req?.params?.id);

            const deleted = await IncomeService.deleteIncomeFromDB(incomeId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Income with this id not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: `Income deleted with this id: ${incomeId} successfully`,
                data: deleted,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = IncomeController;