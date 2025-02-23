const incomeService = require("./income.services");
exports.createIncome = async (req, res) => {
    try {
        const userId = req?.body?.user_id;
        if (!userId)
            return res
                .status(400)
                .json({ success: false, message: "User ID is required" });

        const income = await incomeService.createIncome(req.body);
        return res.status(201).json({
            success: true,
            message: "Successfully entered a new income entry",
            data: income,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllIncomes = async (req, res) => {
    try {
        const incomes = await incomeService.getIncomesFromDB(req.query);
        res.status(200).json(incomes);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getIncomeById = async (req, res) => {
    try {
        const income = await incomeService.getIncomeById(Number(req.params.id));
        res.status(200).json(income);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const income = await incomeService.updateIncome(
            Number(req.params.id),
            req.body
        );
        res.status(200).json(income);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const deleted = await incomeService.deleteIncome(
            Number(req?.params?.id)
        );
        // if (!deleted) {
        //     return res
        //         .status(404)
        //         .json({
        //             success: false,
        //             message: "Income with this id not found",
        //         });
        // }

        return res.status(204).json({
            success: true,
            message: "Income deleted with this id successfully",
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
