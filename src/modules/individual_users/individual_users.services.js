const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const getAllIndividualUsersFromDB = async () => {
    try {
        const allIndividualUsers = await prisma.individualUser.findMany();
        return allIndividualUsers;
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
        const {
            first_name,
            last_name,
            email,
            phone_number,
            password,
            membership,
            purchased_service,
        } = user;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.individualUser.create({
            data: {
                first_name,
                last_name,
                email,
                phone_number,
                hashed_password: hashedPassword,
                membership,
                purchased_service,
            },
        });

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    getAllIndividualUsersFromDB,
    getExistingUserFromDbByEmail,
    insertIndividualUserIntoDB,
};
