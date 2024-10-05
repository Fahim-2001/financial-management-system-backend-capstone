const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
require("colors");
const PORT = process.env.PORT || 8000;

// CORS Options - Defines the allowed to origin to accept requests.
var corsOptions = {
    origin: "*",
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "x-reset-token",
        "x-invite-token",
        "x-api-key",
        "x-www-form-urlencoded",
    ],
    credentials: true,
};

// MIDDLEWARES
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(express.static("public"));

// ROOT ROUTE
app.get("/", async (req, res) => {
    res.status(200).json({
        message: "Welcome to The Valor's Financial Management System Backend Service.",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.green.bold);
});