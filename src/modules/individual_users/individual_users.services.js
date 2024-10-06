const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateTimestamp } = require("../../utils/generativeFunctions");
const prisma = new PrismaClient();

const getAllIndividualUsersFromDB = async () => {
    try {
        const allIndividualUsers = await prisma.individualUser.findMany();
        return allIndividualUsers;
    } catch (error) {
        throw new Error(error);
    }
};

const getExistingUserFromDbById = async (userId) => {
    try {
        const existingUser = await prisma.individualUser.findUnique({
            where: { id: userId },
        });
        return existingUser;
    } catch (error) {
        throw new Error(error);
    }
};

const getExistingUserFromDbByEmail = async (email) => {
    try {
        const existingUser = await prisma.individualUser.findUnique({
            where: { email: email },
        });
        return existingUser;
    } catch (error) {
        throw new Error(error);
    }
};

const insertIndividualUserIntoDB = async (user) => {
    try {
        let {
            first_name,
            last_name,
            email,
            phone_number,
            password,
            created_by,
        } = user;
        const hashedPassword = await bcrypt.hash(password, 10);

        const joinedAt = generateTimestamp();

        if (!created_by) created_by = "Self-registered";

        const newUser = await prisma.individualUser.create({
            data: {
                first_name,
                last_name,
                email,
                phone_number,
                hashed_password: hashedPassword,
                role: null,
                membership_type: null,
                purchased_service: null,
                org_uid: null,
                created_at: joinedAt,
                last_updated_at: joinedAt,
            },
        });

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
};

const updateIndividualUserBasicProfileInfoIntoDB = async (userId, user) => {
    try {
        const { first_name, last_name, email, phone_number } = user;

        const updatedAt = generateTimestamp();

        const updatedUser = await prisma.individualUser.update({
            where: { id: userId },
            data: {
                first_name,
                last_name,
                email,
                phone_number,
                last_updated_at: updatedAt,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

const updateIndividualUserPurchaseInfoIntoDB = async (userId, user) => {
    try {
        const { membership_type, purchased_service } = user;

        const updatedAt = generateTimestamp();

        const updatedUser = await prisma.individualUser.update({
            where: { id: userId },
            data: {
                membership_type,
                purchased_service,
                last_updated_at: updatedAt,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

const deleteIndividualUserFromDbById = async (userId) => {
    try {
        const result = await prisma.individualUser.delete({
            where: { id: userId },
        });
        console.log(result);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    getAllIndividualUsersFromDB,
    getExistingUserFromDbById,
    getExistingUserFromDbByEmail,
    insertIndividualUserIntoDB,
    deleteIndividualUserFromDbById,
};
