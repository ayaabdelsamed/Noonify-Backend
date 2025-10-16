import asyncHandler from "express-async-handler";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import { createOne, deleteOne, getAll, getOne } from "./handlersFactory.js";
import userModel from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { createToken } from "../utils/createToken.js";

// Upload single image
const uploadUserImage = uploadSingleImage('profileImg');

// Image processing
const resizeImage = asyncHandler(async (req, res, next) =>{
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if(req.file) {
        await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95})
        .toFile(`uploads/users/${filename}`);
    // Save image into our db
    req.body.profileImg = filename;
    }
    next();
})

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
const createUser = createOne(userModel)

/**
 * @desc    Get list of users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getAllUsers = getAll(userModel)

/**
 * @desc    Get specific user by id
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
const getSpecificUser = getOne(userModel)

/**
 * @desc    Update specific user 
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            profileImg: req.body.profileImg,
            role: req.body.role,
        },
        { new: true });

    if (!user) {
        return next(new ApiError(`User not found for this ${req.params.id}`, 404));
    }
    
    res.status(200).json({ message: "success", data: user });
})

/**
 * @desc    Change user password by ID
 * @route   PUT /api/v1/users/changePassword/:id
 * @access  Private/Admin
 */
const changeUserPassword = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        { new: true });

    if (!user) {
        return next(new ApiError(`User not found for this ${req.params.id}`, 404));
    }
    
    res.status(200).json({ message: "success", data: user });
})

/**
 * @desc    Delete specific user 
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
const deleteUser = deleteOne(userModel)

/**
 * @desc    Get Logged user data
 * @route   GET /api/v1/users/getMe
 * @access  Private/Protect
 */
const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})

/**
 * @desc    Update Logged user password
 * @route   GET /api/v1/users/changeMyPassword
 * @access  Private/Protect
 */
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based on user payload (req.user._id)
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        { new: true });

    // 2) Generate token
    const token = createToken(user._id);
    res.status(200).json({ message: "success", data: user, token });
})

/**
 * @desc    Update Logged user data(without password, role)
 * @route   GET /api/v1/users/updateMe
 * @access  Private/Protect
 */
const updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        { new: true });
    res.status(200).json({ message: "success", data: updatedUser });
})

/**
 * @desc    Deactivate Logged user
 * @route   DELETE /api/v1/users/deleteMe
 * @access  Private/Protect
 */
const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await userModel.findByIdAndUpdate(
        req.user._id,
        {
            active: false,
        });
    res.status(204).json({ message: "success" });
})

/**
 * @desc    Activate Logged user
 * @route   Put /api/v1/users/activeMe
 * @access  Private/Protect
 */
const activeMe = asyncHandler(async (req, res, next) => {
  // 1) Get token manually
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
    return next(new ApiError("Token not found, please login first", 401));
    }

    // 2) Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3) Find user
    const user = await userModel.findById(decoded.userId);
    if (!user) {
    return next(new ApiError("User not found", 404));
    }

    // 4) Activate user
    user.active = true;
    await user.save();

    res.status(200).json({ message: "User activated successfully" });
});

export{
    uploadUserImage,
    resizeImage,
    createUser,
    getAllUsers,
    getSpecificUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData,
    activeMe
}