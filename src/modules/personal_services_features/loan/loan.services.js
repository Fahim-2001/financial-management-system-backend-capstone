const { parse } = require("dotenv");
const prisma = require("../../../config/prisma.config");
const cache = require("../../../utils/cache");
const {
    findSmallestAvailableId,
} = require("../../../utils/findSmallestAvailableId");
const { generateTimestamp } = require("../../../utils/generativeFunctions");
const {
    calculateRemainingBalance,
    calculateNextDueDate,
} = require("./loans.utils");

const LOAN_CACHE_KEY = "loans_user_";

exports.createLoanInDB = async (data) => {
    const date = generateTimestamp();
    // const missingId = findSmallestAvailableId("loan");

    const loan = await prisma.loan.create({
        data: {
            // id: missingId,
            ...data,
            principal_amount: parseFloat(data?.principal_amount),
            total_paid: parseFloat(data?.total_paid),
            total_amount_with_interest: parseFloat(
                data?.principal_amount +
                    data?.principal_amount * (data?.interest_rate / 100)
            ),
            interest_rate: parseFloat(data?.interest_rate),
            created_at: date,
            updated_at: date,
            user_id: parseInt(data?.user_id),
        },
    });

    const cacheKey = `${LOAN_CACHE_KEY}${loan.user_id}`;
    cache.addItemToCache(cacheKey, loan);

    return loan;
};

exports.getAllLoans = async (user_id) => {
    const cacheKey = `${LOAN_CACHE_KEY}${user_id}`;
    let cachedLoans = cache.nodeCache.get(cacheKey);
    
    if (cachedLoans!== undefined) {
        console.log("Serving loans from cache");
        return cachedLoans;
    }

    const loans = await prisma.loan.findMany({
        where: { user_id },
        include: { payments: true },
    });

    console.log(cachedLoans, loans);
    cache.nodeCache.set(cacheKey, loans);
    return loans;
};

exports.getLoanById = async (loan_id) => {
    return await prisma.loan.findUnique({
        where: { id: loan_id },
    });
};

exports.makePayment = async (loan_id, data) => {
    const loan = await prisma.loan.findUnique({
        where: { id: loan_id },
    });

    if (!loan) throw new Error("Loan not found");

    // Interest Calculation
    const interest_paid = data.amount_paid * (loan.interest_rate / 100);
    const principal_paid = data.amount_paid - interest_paid;

    const remainingBalance = calculateRemainingBalance(
        loan.principal_amount,
        principal_paid
    );

    const updatedLoan = await prisma.loan.update({
        where: { id: loan_id },
        data: {
            current_balance: parseFloat(remainingBalance),
            status: remainingBalance === 0 ? "Paid" : "Active",
            due_date: calculateNextDueDate(
                loan.due_date,
                loan.payment_frequency
            ),
        },
    });

    await prisma.loanPayment.create({ data: {} });

    const cacheKey = `${LOAN_CACHE_KEY}${loan.user_id}`;
    cache.updateItemInCache(cacheKey, updatedLoan);

    return updatedLoan;
};

exports.deleteLoan = async (loan_id) => {
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
};
