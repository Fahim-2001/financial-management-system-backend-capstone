const cacheModule = require("../../../utils/cache");
const {
    filterDataByDaysRange,
    filterDataByMonth,
    filterDataByYear,
} = require("../../../utils/searchByQuery");
const incomeService = require("./income.services");
const cacheKey = "incomes";
exports.createIncome = async (req, res, next) => {
    try {
        const userId = req?.body?.user_id;
        if (!userId)
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });

        const income = await incomeService.createIncome(req.body);

        cacheModule.deleteCachedData(cacheKey);
        return res.status(201).json({
            success: true,
            message: "Successfully entered a new income entry",
            data: income,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllIncomes = async (req, res, next) => {
    try {
        const userId = parseInt(req?.query?.user_id);
        const month = req?.query?.month;
        const year = req?.query?.year;
        const days = req?.query?.days;

        let incomes = cacheModule.getCachedData(cacheKey);
        if (!incomes) {
            incomes = await incomeService.getIncomesFromDB();
            cacheModule.setDataToCache(cacheKey, incomes);
        }

        if (userId) {
            incomes = await incomeService.getAllIncomesByUserId(
                userId,
                incomes
            );
        }

        if (days) {
            startDayInMs = Date.now() - Number(days) * 86400000; // 1 day = 86,400,000 milliseconds
            incomes = filterDataByDaysRange(
                incomes,
                "date",
                startDayInMs,
                Date.now()
            );
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
};

exports.getIncomeById = async (req, res, next) => {
    try {
        const income = await incomeService.getIncomeById(Number(req.params.id));
        res.status(200).json(income);
    } catch (err) {
        next(err);
    }
};

exports.updateIncome = async (req, res, next) => {
    try {
        const incomeId = parseInt(req?.params?.id);
        const income = await incomeService.updateIncomeFromDB(
            incomeId,
            req?.body
        );

        cacheModule.deleteCachedData(cacheKey)
        return res.status(200).json({
            success: true,
            message: `Successfully updated income entry ${incomeId}`,
            data: income,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteIncome = async (req, res, next) => {
    try {
        const incomeId = parseInt(req?.params?.id);

        const deleted = await incomeService.deleteIncomeFromDB(incomeId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Income with this id not found",
            });
        }

        cacheModule.deleteCachedData(cacheKey)
        return res.status(200).json({
            success: true,
            message: `Income deleted with this id: ${incomeId} successfully`,
            data: deleted,
        });
    } catch (err) {
        next(err);
    }
};
