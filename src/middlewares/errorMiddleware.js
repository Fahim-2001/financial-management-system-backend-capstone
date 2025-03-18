const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // If the error has a status code, use it; otherwise, default to 500 (server error)
    const statusCode = err.statusCode || 500;

    // Respond with a JSON error message
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        // Optionally include the stack trace in non-production environments
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = errorHandler;
