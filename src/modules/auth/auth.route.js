const express = require("express");
const { login } = require("./auth.controller");
const authRouter = express.Router();

authRouter.post("/login", login);
// authRouter.patch("/:email", forgetPassword);

module.exports = authRouter;
