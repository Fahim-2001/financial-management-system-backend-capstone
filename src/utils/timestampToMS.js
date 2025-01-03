function timestampToMilliseconds(timestamp = String) {
    // Create a Date object from the given timestamp
    const date = new Date(timestamp);

    // Get the time in milliseconds
    return date.getTime();
}
module.exports = { timestampToMilliseconds };
