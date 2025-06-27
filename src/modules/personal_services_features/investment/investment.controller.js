const InvestmentService = require("./investment.services");

class InvestmentController {
    static async createInvestment(req, res, next) {
        try {
            const investment = await InvestmentService.createInvestment(
                req.body
            );
            return res.status(201).json({
                success: true,
                message: "Investment created successfully",
                data: investment,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getInvestmentById(req, res, next) {
        try {
            const investment = await InvestmentService.getInvestmentById(
                parseInt(req.params.id)
            );
            return res.json({
                success: true,
                message: "Investment retrieved successfully",
                data: investment,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserInvestments(req, res, next) {
        try {
            const investments = await InvestmentService.getUserInvestments(
                parseInt(req.params.userId)
            );
            return res.json({
                success: true,
                message: "User investments retrieved successfully",
                data: investments,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateInvestment(req, res, next) {
        try {
            const investment = await InvestmentService.updateInvestment(
                parseInt(req.params.id),
                req.body
            );
            return res.json({
                success: true,
                message: "Investment updated successfully",
                data: investment,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteInvestment(req, res, next) {
        try {
            await InvestmentService.deleteInvestment(parseInt(req.params.id));
            return res
                .status(200)
                .json({
                    success: true,
                    message: "Investment deleted successfully",
                });
        } catch (error) {
            next(error);
        }
    }

    
}

module.exports = InvestmentController;
