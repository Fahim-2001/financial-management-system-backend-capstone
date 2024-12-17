const express = require("express");
const {
    getAllUsers,
    addUser,
    deleteUserById,
    getUserById,
    getUserByEmail,
    updateUserById,
} = require("./users.controller");
const userRouter = express.Router();

userRouter.route("/").get(getAllUsers);

userRouter.route("/:id").get(getUserById).put(updateUserById).delete(deleteUserById);
userRouter.route("/email/:email").get(getUserByEmail);

module.exports = userRouter;
