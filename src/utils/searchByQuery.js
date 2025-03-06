const searchByQuery = (records, query, value) => {
    return records?.filter((record) =>
        record[query]?.toLowerCase()?.includes(value?.toLowerCase())
    );
};

const searchByRangeQuery = (records, query, startTime, endTime) => {
    return records?.filter((record) => {
        const requiredDay = record[query];
        const reqiredDayInMs = new Date(requiredDay).getTime();
        return startTime <= reqiredDayInMs && reqiredDayInMs <= endTime;
    });
};

module.exports = { searchByQuery, searchByRangeQuery };
