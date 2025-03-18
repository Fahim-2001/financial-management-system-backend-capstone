const express = require("express");
const authController = require("./auth.controller");
const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/signup", authController.signup);
// authRouter.patch("/:email", forgetPassword);

module.exports = authRouter;
