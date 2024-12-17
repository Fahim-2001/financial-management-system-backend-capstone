const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();
require("colors");
const errorHandler = require("./middlewares/errorMiddleware");
const PORT = process.env.PORT || 8000;

// ROUTER IMPORTS
const AuthRoute = require("./modules/auth/auth.route");
const UsersRoute = require("./modules/users/users.route");
const FinServicesRoute = require("./modules/fin_services/fin_services.route");

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

// CUSTOM API ROUTES
app.use("/api/v1/users", UsersRoute);
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/financial-services", FinServicesRoute);
app.use(errorHandler);

// ROOT ROUTE
app.get("/", async (req, res) => {
    res.status(200).json({
        message:
            "Welcome to The Valor's Financial Management System Backend Service.",
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.green.bold);
});
