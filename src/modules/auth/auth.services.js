const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { transporter } = require("../utils/nodemailer");
const { generateTemporaryPassword, generateTimestamp } = require("../../utils/generativeFunctions");
const { findSmallestAvailableId } = require("../../utils/findSmallestAvailableId");
const prisma = new PrismaClient();

const createToken = async (user) => {
    try {
        const token = jwt.sign(
            {
                first_name: user?.first_name,
                last_name: user?.last_name,
                email: user?.email,
                role: user?.role | '',
                user_type: user?.user_type,
            },
            process.env.JWT_SECRET,
            { expiresIn: 24 * 60 * 60 }
        );
        return token;
    } catch (error) {
        throw new Error(error.message);
    }
};

const verifyToken = (token) => {
    try {
        if (!token) throw new Error("Token not provided!");
        const decoded = jwt.verify(token, process.env.SECRET);
        return decoded;
    } catch (e) {
        return false;
    }
};

const verifyUser = async (user) => {
    try {
        if (!user) throw new Error("No user provided");

        // Find the user by email (case insensitive)
        const registeredUser = await prisma.user.findUnique({
            where: {
                email: user.email.trim().toLowerCase(),
            },
        });

        if (!registeredUser) {
            throw new Error("No user exists with these credentials");
        }

        // Compare provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(
            user.password,
            registeredUser.hashed_password
        );

        if (!isPasswordValid) {
            throw new Error("Password didn't match");
        }
        console.log(registeredUser);
        return registeredUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const sendTemporaryPassword = async (user) => {
    try {
        const temporaryPassword = generateTemporaryPassword();
        const mail = await transporter.sendMail({
            from: process.env.EMAIL,
            to: user?.email,
            subject: "Temporary password regarding 'Forgot Password'.",
            html: `
              <h1>Hello ,${user?.username}. Your Temporary Password</h1>
              </br>
              <h1>${temporaryPassword}</h1>
              </br>
              <p><small>Use this password to login into Rahimafrooz Battery Ltd Dashboard as a Super Admin/Admin</small></p>
              <p><small>You can change this password into dashboard's "Admin Profile" section.</small></p>
              <p><small>Change the password as soos as possible for better security.</small></p>
              <p><small>Don't share this password with anyone</small></p>
              <h3>Thank You!</h3>`,
        });

        return temporaryPassword;
    } catch (error) {
        throw new Error(error.message);
    }
};

const registerUserIntoDB = async (user = Object) => {
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

module.exports = {
    createToken,
    verifyUser,
    verifyToken,
    sendTemporaryPassword,
    registerUserIntoDB
};
