const express = require("express");
const { login, signup } = require("./auth.controller");
const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
// authRouter.patch("/:email", forgetPassword);

module.exports = authRouter;
