const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateTimestamp } = require("../../utils/generativeFunctions");
const {
    findSmallestAvailableId,
} = require("../../utils/findSmallestAvailableId");
const prisma = new PrismaClient();

const getAllUsersFromDB = async () => {
    try {
        let allUsers = await prisma.user.findMany({
            orderBy: { id: "asc" },
        });

        return allUsers;
    } catch (error) {
        throw new Error(error);
    }
};

const getExistingUserFromDbById = async (userId = Number) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });
        return existingUser;
    } catch (error) {
        throw new Error(error);
    }
};

const getExistingUserFromDbByEmail = async (email = String) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        return existingUser;
    } catch (error) {
        throw new Error(error);
    }
};

const addUserIntoDB = async (user = Object) => {
    try {
        let { first_name, last_name, email, phone_number, password } = user;
        const hashedPassword = await bcrypt.hash(password, 10);

        const joinedAt = generateTimestamp();

        const missingId = await findSmallestAvailableId("user");
        const newUser = await prisma.user.create({
            data: {
                id: missingId,
                first_name,
                last_name,
                email,
                phone_number,
                hashed_password: hashedPassword,
                profile_picture_url: null,
                user_type: "general_user",
                joined_at: joinedAt,
                updated_at: joinedAt,
            },
        });

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
};

const updateUserBasicProfileInfoIntoDB = async (
    userId = Number,
    user = Object
) => {
    try {
        const existingUser = await getExistingUserFromDbById(userId);
        if (!existingUser) {
            throw new Error("No User Found on this Id");
        }
        const { first_name, last_name, email, phone_number } = user;

        const updatedAt = generateTimestamp();

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone_number: phone_number,
                updated_at: updatedAt,
            },
        });
        // Implement Logic on removing Email
    } catch (error) {
        throw new Error(error);
    }
};

const updateUserProfilePicIntoDB = async (userId = Number, user = Object) => {
    try {
        const { profile_picture_url } = user;

        const updatedAt = generateTimestamp();

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                profile_picture_url,
                updated_at: updatedAt,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

const updateUserPurchaseInfoIntoDB = async (userId = Number, user = Object) => {
    try {
        const { user_type, purchased_services } = user;

        const updatedAt = generateTimestamp();

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                user_type,
                purchased_services,
                updated_at: updatedAt,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

const deleteUserFromDbById = async (userId = Number) => {
    try {
        const result = await prisma.user.delete({
            where: { id: userId },
        });
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    getAllUsersFromDB,
    getExistingUserFromDbById,
    getExistingUserFromDbByEmail,
    addUserIntoDB,
    updateUserBasicProfileInfoIntoDB,
    updateUserProfilePicIntoDB,
    updateUserPurchaseInfoIntoDB,
    deleteUserFromDbById,
};
