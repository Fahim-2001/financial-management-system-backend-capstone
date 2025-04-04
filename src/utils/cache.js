const NodeCache = require("node-cache");
const nodeCache = new NodeCache({ stdTTL: 3600 });

const getCachedData = (key = String) => {
    try {
        if (!key) throw new Error("No key provided to caching process");

        let data;
        if (nodeCache.has(key)) {
            data = JSON.parse(nodeCache.get(key));
            return data;
        }
        console.log("No data found according to the key");
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const setDataToCache = (key = String, data) => {
    try {
        if (!key) throw new Error("No key provided to caching process");
        if (!data) throw new Error("No data provided to caching process");

        nodeCache.set(key, JSON.stringify(data));
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteCachedData = (key = String) => {
    try {
        if (!key) throw new Error("No key provided to caching process");

        nodeCache.del(key);
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getCachedData,
    setDataToCache,
    deleteCachedData,
};
