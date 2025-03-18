const jwt = require("jsonwebtoken");
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user)
        return res.status(401).json({
            error: "Invalid Access token",
        });

    req.user = user;
    return next();
};

module.exports = verifyAccessToken;
