// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";

// eslint-disable-next-line import/prefer-default-export
export const createToken = (payload) => jwt.sign(
    { userId: payload },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME || "30d" }
);