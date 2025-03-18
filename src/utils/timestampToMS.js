function timestampToMilliseconds(timestamp = String) {
    // Create a Date object from the given timestamp
    const date = new Date(timestamp);

    // Get the time in milliseconds
    return date.getTime();
}

function convertDateFormat(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
module.exports = { timestampToMilliseconds, convertDateFormat };
