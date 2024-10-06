const express = require("express");
const {
    getAllIndividualUsers,
    createIndividualUsers,
    deleteIndividualUserById,
} = require("./individual_users.controller");
const individualUsersRouter = express.Router();

individualUsersRouter
    .route("/")
    .get(getAllIndividualUsers)
    .post(createIndividualUsers);

individualUsersRouter.route("/:id").delete(deleteIndividualUserById);

module.exports = individualUsersRouter;
