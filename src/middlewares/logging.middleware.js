const morgan = require("morgan");
const chalk = require("chalk");

const morganMiddleware = morgan(function (tokens, req, res) {
    const bstDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
    });

    return [
        chalk.blue.bold(tokens.method(req, res)), // HTTP Method
        chalk.green(tokens.url(req, res)), // URL
        chalk.yellow(tokens.status(req, res)), // Status Code
        chalk.magenta(tokens["response-time"](req, res) + " ms"), // Response Time
        chalk.cyan(
            "Content-Length: " + tokens.res(req, res, "content-length") || 0
        ),
        chalk.gray("Datetime(BST): " + bstDate), // Date
    ].join(" | ");
});

module.exports = { morganMiddleware };
