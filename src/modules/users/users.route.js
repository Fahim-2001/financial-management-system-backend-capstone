const express = require("express");
const usersController = require("./users.controller");
const userRouter = express.Router();

userRouter.route("/").get(usersController.getAllUsers).post(usersController.addUser);

userRouter.route("/:id").get(usersController.getUserById).put(usersController.updateUserById).delete(usersController.deleteUserById);
userRouter.route("/email/:email").get(usersController.getUserByEmail);

module.exports = userRouter;