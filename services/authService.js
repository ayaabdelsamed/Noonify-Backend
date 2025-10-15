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

/**
 * @desc    Make sure the user is logged in
 * @route   Middleware
 * @access  Private
 */
const protectedRoutes = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if ( req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) { 
        return next(new ApiError("You are not logged in. Please login to access this route", 401));
    }

    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user exists
    const currentUser = await userModel.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError("The user that belong to this token no longer exists", 401));
    }

    // 4) Check if user change his password after token created
    if(currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000, 10);
        // Password changed after token created (Error)
        if(passChangedTimestamp > decoded.iat) {
            return next(new ApiError("User recently changed his password. please login again..", 401));
        }
    }
    req.user = currentUser;
    next();
});

/**
 * @desc    Allow Access to Specific Roles
 */
const allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    // 1) Access roles
    // 2) Access registered user (req.user.role)
    if(!roles.includes(req.user.role)) {
        return next(new ApiError("You are not allowed to access this route", 403));
    }
    next();
});
export{
    signUp,
    logIn,
    protectedRoutes,
    allowedTo
}