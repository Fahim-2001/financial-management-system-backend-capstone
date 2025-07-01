const prisma = require("../../../config/prisma.config");
const cache = require("../../../utils/cache");
const { generateTimestamp } = require("../../../utils/generativeFunctions");
const {
    calculateRemainingBalance,
    calculateNextDueDate,
    calculateYearsDifference,
} = require("./loans.utils");

const LOAN_CACHE_KEY = "loans_user_";

class LoanService {
    static async createLoanInDB(data) {
        const date = generateTimestamp();
        // const missingId = findSmallestAvailableId("loan");
        const yearsDifference = calculateYearsDifference(
            data?.start_date,
            data?.end_date
        );

        const total_payable =
            yearsDifference < 1
                ? parseFloat(data?.principal_amount) +
                  (parseFloat(data?.principal_amount) *
                      parseFloat(data?.interest_rate)) /
                      100
                : parseFloat(data?.principal_amount) +
                  ((parseFloat(data?.principal_amount) *
                      parseFloat(data?.interest_rate)) /
                      100) *
                      yearsDifference;

        const due = (total_payable - parseFloat(data?.total_paid)).toFixed(3);

        const loan = await prisma.loan.create({
            data: {
                // id: missingId,
                ...data,
                principal_amount: parseFloat(data?.principal_amount),
                total_paid: parseFloat(data?.total_paid),
                total_payable: total_payable,
                due: parseFloat(due),
                interest_rate: parseFloat(data?.interest_rate),
                number_of_payments: parseInt(data?.number_of_payments),
                remaining_payments: parseInt(data?.remaining_payments),
                created_at: date,
                updated_at: date,
                user_id: parseInt(data?.user_id),
            },
        });

        const cacheKey = `${LOAN_CACHE_KEY}${loan.user_id}`;
        cache.addItemToCache(cacheKey, loan);

        return loan;
    }

    static async getAllLoans(user_id) {
        const cacheKey = `${LOAN_CACHE_KEY}${user_id}`;
        let cachedLoans = cache.nodeCache.get(cacheKey);

        if (cachedLoans !== undefined) {
            console.log("Serving loans from cache");
            return cachedLoans;
        }

        const loans = await prisma.loan.findMany({
            where: { user_id },
            orderBy: { id: "asc" },
            include: { payments: true },
        });

        cache.nodeCache.set(cacheKey, loans);
        return loans;
    }

    static async getLoanById(loan_id) {
        return await prisma.loan.findUnique({
            where: { id: loan_id },
            include: { payments: true },
        });
    }

    static async makePayment(loan_id, data) {
        const loan = await prisma.loan.findUnique({
            where: { id: loan_id },
        });

        if (!loan) throw new Error("Loan not found");

        // Interest Calculation
        const interest_paid = (
            loan?.payment_frequency == "Monthly"
                ? parseFloat(data.amount_paid) *
                  (parseFloat(loan.interest_rate) / 100 / 12)
                : loan?.payment_frequency == "BiWeekly"
                ? parseFloat(data.amount_paid) *
                  (parseFloat(loan.interest_rate) / 100 / 26)
                : parseFloat(data.amount_paid) *
                  (parseFloat(loan.interest_rate) / 100 / 52)
        ).toFixed(3);

        const principal_paid = (
            parseFloat(data.amount_paid) - parseFloat(interest_paid)
        ).toFixed(3);

        const remainingBalance = calculateRemainingBalance(
            parseFloat(loan.total_payable),
            parseFloat(loan.total_paid) + parseFloat(data.amount_paid)
        );

        const updatedLoan = await prisma.loan.update({
            where: { id: loan_id },
            data: {
                total_paid:
                    parseFloat(loan.total_paid) + parseFloat(data.amount_paid),
                due: parseFloat(remainingBalance),
                status: remainingBalance === 0 ? "Paid" : "Active",
                next_payment_date: calculateNextDueDate(
                    loan.next_payment_date,
                    loan.payment_frequency
                ),
                remaining_payments: parseInt(loan.remaining_payments) - 1,
            },
        });

        await prisma.loanPayment.create({
            data: {
                ...data,
                loan_id: parseInt(loan_id),
                amount_paid: parseFloat(data.amount_paid),
                interest_paid: parseFloat(interest_paid),
                principal_paid: parseFloat(principal_paid),
                remaining_balance: parseFloat(remainingBalance),
                notes: data.notes || "",
                payment_date: data.payment_date || generateTimestamp(),
                created_at: generateTimestamp(),
            },
        });

        const cacheKey = `${LOAN_CACHE_KEY}${loan.user_id}`;
        cache.updateItemInCache(cacheKey, updatedLoan);

        return updatedLoan;
    }

    static async deleteLoan(loan_id) {
        console.log(loan_id);
        const loan = await prisma.loan.findUnique({
            where: { id: loan_id },
        });

        if (!loan) throw new Error("Loan not found");

        await prisma.loan.delete({
            where: { id: loan_id },
        });

        const cacheKey = `${LOAN_CACHE_KEY}${loan.user_id}`;
        cache.deleteItemFromCache(cacheKey, loan_id);

        return loan;
    }

    static async deleteLoanPayment(loan_id, payment_id) {
        const currentDateTime = generateTimestamp();
        const payment = await prisma.loanPayment.findUnique({
            where: { id: payment_id },
        });

        if (!payment) throw new Error("Payment not found");
        if (payment.loan_id !== loan_id)
            throw new Error("Payment does not belong to the specified loan");

        const loan = await prisma.loan.findUnique({ where: { id: loan_id } });
        if (!loan) throw new Error("Loan not found");

        // Reverse the payment effect (e.g., subtract amount_paid from total_paid)
        const updatedTotalPaid = loan.total_paid - payment.amount_paid;
        const remainingBalance = calculateRemainingBalance(
            loan.principal_amount,
            loan.total_paid - payment.amount_paid
        );

        const updatedLoan = await prisma.loan.update({
            where: { id: loan_id },
            data: {
                total_paid: updatedTotalPaid,
                current_balance: parseFloat(remainingBalance),
                status: remainingBalance === 0 ? "PaidOff" : "Active",
                updated_at: currentDateTime,
            },
        });

        await prisma.loanPayment.delete({
            where: { id: payment_id },
        });

        const cacheKey = `${LOAN_CACHE_KEY}${loan.user_id}`;
        cache.updateItemInCache(cacheKey, updatedLoan);

        return { message: "Loan payment deleted successfully", updatedLoan };
    }
}

module.exports = LoanService;
