const InvestmentPerfomanceServices = require("./investmentPerformance.services");

class InvestmentPerformanceController {
    static async createInvestmentPerformance(req, res, next) {
        try {
            const { id } = req.params;
            
            const performance =
                await InvestmentPerfomanceServices.createInvestmentPerformance(
                    parseInt(id),
                    req.body
                );
            res.status(201).json({
                success: true,
                message: "Created Successfully",
                data: performance,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteInvestmentPerformance(req, res, next) {
        try {
            const { id, performance_id } = req.params;
            await InvestmentPerfomanceServices.deleteInvestmentPerformance(
                parseInt(id),
                parseInt(performance_id)
            );
            res.status(200).json({
                success: true,
                message: "Deleted Successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InvestmentPerformanceController;
