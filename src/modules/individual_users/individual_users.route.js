const express = require("express");
const {
    getAllIndividualUsers,
    createIndividualUsers,
} = require("./individual_users.controller");
const individualUsersRouter = express.Router();

individualUsersRouter
    .route("/")
    .get(getAllIndividualUsers)
    .post(createIndividualUsers);

module.exports = individualUsersRouter;
