const budgetService = require("./budget.services");

exports.createBudget = async (req, res, next) => {
    try {
        const budget = await budgetService.createBudget(req.body);
        return res.status(201).json({
            success: true,
            message: "Successfully entered a new budget entry",
            data: budget,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllBudgets = async (req, res, next) => {
    try {
        const { user_id } = req?.query;
        console.log(user_id)
        const budgets = await budgetService.getAllBudgetsOfAnUser(
            parseInt(user_id)
        );
        return res.status(200).json({
            success: true,
            total: budgets.length,
            data: budgets,
        });
    } catch (err) {
        next(err);
    }
};

exports.getBudgetById = async (req, res, next) => {
    try {
        const budget = await budgetService.getBudgetById(
            parseInt(req.params.id)
        );
        return res.status(200).json({
            success: true,
            data: budget,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateBudget = async (req, res, next) => {
    try {
        const updated = await budgetService.updateBudget(
            parseInt(req.params.id),
            req.body
        );
        return res.status(200).json({
            success: true,
            message: "Successfully updated the new budget entry",
            data: updated,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteBudget = async (req, res, next) => {
    try {
        await budgetService.deleteBudget(parseInt(req.params.id));
        return res.status(204).json({
            success: true,
            message: "Successfully deleted budget entry",
        });
    } catch (err) {
        next(err);
    }
};

// Sub Events
exports.addSubEvent = async (req, res, next) => {
    try {
        const event = await budgetService.addSubEvent(
            parseInt(req.params.id),
            req.body
        );
        res.status(201).json({
            success: true,
            message: "Successfully entered a new entry",
            data: income,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteSubEvent = async (req, res, next) => {
    try {
        await budgetService.deleteSubEvent(parseInt(req.params.subId));
        return res.status(204).json({
            success: true,
            message: "Successfully deleted",
        });
    } catch (err) {
        next(err);
    }
};
