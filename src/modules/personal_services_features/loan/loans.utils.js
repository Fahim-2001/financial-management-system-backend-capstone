function calculateRemainingBalance(loanAmount, amountPaid) {
    return Math.max(loanAmount - amountPaid, 0);
}

function calculateNextDueDate(currentDueDate, paymentFrequency) {
    const nextDue = new Date(currentDueDate);
    switch (paymentFrequency) {
        case "weekly":
            nextDue.setDate(nextDue.getDate() + 7);
            break;
        case "biweekly":
            nextDue.setDate(nextDue.getDate() + 14);
            break;
        case "monthly":
            nextDue.setMonth(nextDue.getMonth() + 1);
            break;
        default:
            break;
    }
    return nextDue.toISOString();
}

module.exports = {
    calculateRemainingBalance,
    calculateNextDueDate,
};
