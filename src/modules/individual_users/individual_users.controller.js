const {
    getExistingUserFromDbByEmail,
    insertIndividualUserIntoDB,
    getAllIndividualUsersFromDB,
} = require("./individual_users.services");

const getAllIndividualUsers = async (req, res, next) => {
    try {
        const allIndividualUsers = await getAllIndividualUsersFromDB();
        res.status(200).json({
            success: true,
            data: allIndividualUsers,
        });
    } catch (error) {
        next(error);
    }
};
const createIndividualUsers = async (req, res, next) => {
    try {
        const individualUser = req?.body;
        const existingUser = await getExistingUserFromDbByEmail(
            individualUser?.email
        );
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists." });
        }

        const newUser = await insertIndividualUserIntoDB(individualUser);

        res.status(201).json({
            message: "User added successfully",
            user: newUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllIndividualUsers, createIndividualUsers };
