const searchByQuery = (records, query, value) => {
    return records?.filter((record) =>
        record[query]?.toLowerCase()?.includes(value?.toLowerCase())
    );
};

module.exports = { searchByQuery };
