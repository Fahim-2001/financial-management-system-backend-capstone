const goalEntryService = require("./goalEntry.services");
exports.createGoalEntry = async (req, res, next) => {
    try {
        const {goal_id} = req?.params;
        const data = req.body;
        const newEntry = await goalEntryService.createGoalEntry(data, goal_id);
        res.status(201).json(newEntry);
    } catch (err) {
        next(err)
    }
};

exports.getAllGoalEntries = async (req, res, next) => {
    try {
        const { goal_id } = req?.query;
        const entries = await goalEntryService.getAllGoalEntries(goal_id);
        res.status(200).json(entries);
    } catch (err) {
        next(err)
    }
};

exports.getGoalEntryById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const entry = await goalEntryService.getGoalEntryById(id);
        res.status(200).json(entry);
    } catch (err) {
        next(err)
    }
};

exports.updateGoalEntry = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updated = await goalEntryService.updateGoalEntry(id, data);
        res.status(200).json(updated);
    } catch (err) {
        next(err)
    }
};

exports.deleteGoalEntry = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await goalEntryService.deleteGoalEntry(id);
        res.status(200).json(deleted);
    } catch (err) {
        next(err)
    }
};

