const {
    setDataToCache,
    getCachedData,
    deleteCachedData,
} = require("../../utils/cache");
const { searchByQuery } = require("../../utils/searchByQuery");
const { createToken } = require("../auth/auth.services");
const {
    getAllUsersFromDB,
    getExistingUserFromDbById,
    getExistingUserFromDbByEmail,
    insertUserIntoDB,
    deleteUserFromDbById,
} = require("./users.services");
const cacheKey = "users";

const getAllUsers = async (req, res, next) => {
    try {
        const first_name = req?.query?.first_name;
        const last_name = req?.query?.last_name;
        const email = req?.query?.email;
        const phone = req?.query?.phone;

        let allUsers = getCachedData(cacheKey);

        if (!allUsers) {
            allUsers = await getAllUsersFromDB();
            setDataToCache(cacheKey, allUsers);
        }
        // console.log(allUsers)

        if (email) {
            allUsers = searchByQuery(allUsers, "email", email);
        }

        if (first_name) {
            allUsers = searchByQuery(allUsers, "first_name", first_name);
        }

        if (last_name) {
            allUsers = searchByQuery(allUsers, "last_name", last_name);
        }

        if (phone) {
            allUsers = searchByQuery(allUsers, "phone_number", phone);
        }

        res.status(200).json({
            success: true,
            total: allUsers.length,
            data: allUsers,
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const userId = Number(req?.params?.id);
        const user = await getExistingUserFromDbById(userId);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const getUserByEmail = async (req, res, next) => {
    try {
        const userEmail = req?.params?.email;
        const user = await getExistingUserFromDbByEmail(userEmail);

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const createUsers = async (req, res, next) => {
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

        const newUser = await insertUserIntoDB(individualUser);

        // Sign a token to the newly registered user
        const token = await createToken(newUser);
        res.cookie("token", token);
        newUser.token = token;

        deleteCachedData(cacheKey);
        return res.status(201).json({
            success: true,
            message: "User added successfully",
            user: newUser,
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);

        const existingUser = await getExistingUserFromDbById(userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        deleteUserFromDbById(userId);

        deleteCachedData(cacheKey);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUsers,
    deleteUserById,
};
