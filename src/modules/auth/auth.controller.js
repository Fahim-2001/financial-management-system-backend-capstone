const { deleteCachedData } = require("../../utils/cache");
const {
    getExistingUserFromDbByEmail,
} = require("../users/users.services");
const {
    verifyUser,
    createToken,
    sendTemporaryPassword,
    registerUserIntoDB,
} = require("./auth.services");
const cacheKey = "users";

const login = async (req, res) => {
    try {
        // console.log(req.body);
        const verifiedUser = await verifyUser(req.body);
        const token = await createToken(verifiedUser);
        res.cookie("token", token);
        return res.status(200).json({
            username: verifiedUser?.username,
            email: verifiedUser?.email,
            role: verifiedUser?.role,
            token: token,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: `${error.message}` });
    }
};

const signup = async (req, res, next) => {
    try {
        const user = req?.body;
        const existingUser = await getExistingUserFromDbByEmail(
            user?.email
        );

        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists." });
        }

        const newUser = await registerUserIntoDB(user);

        // Sign a token to the newly registered user
        const token = await createToken(newUser);
        res.cookie("token", token);
        newUser.token = token;

        deleteCachedData(cacheKey);
        return res.status(201).json({
            success: true,
            message: "Sign Up successful"
        });
    } catch (error) {
        next(error);
    }
};

// const forgetPassword = async (req, res) => {
//     try {
//         const { email } = req?.params;
//         console.log(email);
//         const existingUser = await getExistingUserFromDbByEmail(email);

//         if (existingUser.rowCount === 0)
//             return res.status(404).json("User Not Found!");

//         const newPassword = await sendTemporaryPassword(existingUser.rows[0]);

//         await updatePasswordInDB(newPassword, email);

//         return res.status(200).json(`Email sent with new temporary password!`);
//     } catch (error) {
//         return res.status(500).json({ message: `${error.message}` });
//     }
// };

module.exports = {
    login,
    signup,
};
