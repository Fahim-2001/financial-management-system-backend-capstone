const searchByQuery = (records, query, value) => {
    return records?.filter((record) =>
        record[query]?.toLowerCase()?.includes(value?.toLowerCase())
    );
};

const filterDataByDaysRange = (records, query, startTime, endTime) => {
    return records?.filter((record) => {
        const requiredDay = record[query];
        const reqiredDayInMs = new Date(requiredDay).getTime();
        return startTime <= reqiredDayInMs && reqiredDayInMs <= endTime;
    });
};

const filterDataByMonth = (records, selectedMonth, selectedYear) => {
    return records.filter((record) => {
        const [datePart] = record.date.split(" "); // Extracting 'YYYY-MM-DD' from 'YYYY-MM-DD HH:MM:SS'
        const [year, month] = datePart.split("-").map(Number);
        return (
            month === parseInt(selectedMonth) && year === parseInt(selectedYear)
        );
    });
};

const filterDataByYear = (records, selectedYear) => {
    return records.filter((record) => {
        const [datePart] = record.date.split(" "); // Extracting 'YYYY-MM-DD' from 'YYYY-MM-DD HH:MM:SS'
        const [year] = datePart.split("-").map(Number);
        return year === parseInt(selectedYear);
    });
};

module.exports = {
    searchByQuery,
    filterDataByDaysRange,
    filterDataByMonth,
    filterDataByYear,
};
