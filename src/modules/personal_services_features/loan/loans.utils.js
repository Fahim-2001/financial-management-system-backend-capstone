function calculateRemainingBalance(loanAmount, amountPaid) {
    return (loanAmount - amountPaid).toFixed(3);
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

function calculateYearsDifference(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Calculate the difference in milliseconds
    const diffMs = endDate - startDate;

    // Convert to years (ignoring leap years for simplicity)
    const msPerYear = 365 * 24 * 60 * 60 * 1000; // 31,536,000,000 ms
    const years = diffMs / msPerYear;

    return Math.round(years * 100) / 100;
}

module.exports = {
    calculateRemainingBalance,
    calculateNextDueDate,
    calculateYearsDifference,
};
