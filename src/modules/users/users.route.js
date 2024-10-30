const express = require("express");
const {
    getAllUsers,
    createUsers,
    deleteUserById,
    getUserById,
    getUserByEmail,
} = require("./users.controller");
const user = express.Router();

user.route("/").get(getAllUsers).post(createUsers);

user.route("/:id").get(getUserById).delete(deleteUserById);
user.route("/email/:email").get(getUserByEmail);

module.exports = user;
