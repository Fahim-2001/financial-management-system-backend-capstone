const NodeCache = require("node-cache");
const nodeCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

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

// Update an item inside a cached array
const updateItemInCache = (cacheKey, updatedItem, idField = "id") => {
    let cachedArray = nodeCache.get(cacheKey);

    if (cachedArray) {
        const index = cachedArray.findIndex(
            (item) => item[idField] === updatedItem[idField]
        );
        if (index !== -1) {
            cachedArray[index] = { ...cachedArray[index], ...updatedItem };
            nodeCache.set(cacheKey, cachedArray);
        }
    }
};

// Add a new item inside cached array
const addItemToCache = (cacheKey, newItem) => {
    let cachedArray = nodeCache.get(cacheKey);

    if (cachedArray) {
        cachedArray.push(newItem);
        nodeCache.set(cacheKey, cachedArray);
    }
};

// Remove an item from cached array
const deleteItemFromCache = (cacheKey, itemId, idField = "id") => {
    let cachedArray = nodeCache.get(cacheKey);

    if (cachedArray) {
        cachedArray = cachedArray.filter((item) => item[idField] !== itemId);
        nodeCache.set(cacheKey, cachedArray);
    }
};

module.exports = {
    nodeCache,
    getCachedData,
    setDataToCache,
    deleteCachedData,
    updateItemInCache,
    addItemToCache,
    deleteItemFromCache,
};
