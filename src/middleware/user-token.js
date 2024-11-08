import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const userToken = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    console.log(accessToken);
    

    if (!token) {
        return res.status(401).json({ message: "Token verification failed" });
    }

    const jwt_secret = process.env.JWT_SECRET || "HEY THIS IS SECRET KEY"

    jwt.verify(token, jwt_secret, (err, decode) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.email = decode.email;
        next();
    });
};