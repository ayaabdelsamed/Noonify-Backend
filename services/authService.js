import asyncHandler from "express-async-handler";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import ApiError from "../utils/apiError.js";

const createToken = (payload) => jwt.sign(
        { userId: payload },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE_TIME || "30d" }
    )
/**
 * @desc    SignUp
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
const signUp = asyncHandler(async (req, res, next) => {
    // 1) Create user
    const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    // 2) Generate jwt token
    const token = createToken(user._id);
    res.status(201).json({ message: "success", data: user, token });
})

/**
 * @desc    LogIn
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const logIn = asyncHandler(async (req, res, next) => {
    // 1) Check if user exist & check if password is correct
    const user = await userModel.findOne({ email: req.body.email });

    if(!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    // 2) Generate jwt token
    const token = createToken(user._id);
    res.status(201).json({ message: "success", data: user, token });
})
export{
    signUp,
    logIn
}