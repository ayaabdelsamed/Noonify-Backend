import asyncHandler from "express-async-handler";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";

import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import { createOne, deleteOne, getAll, getOne } from "./handlersFactory.js";
import userModel from "../models/userModel.js";
import ApiError from "../utils/apiError.js";

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


export{
    uploadUserImage,
    resizeImage,
    createUser,
    getAllUsers,
    getSpecificUser,
    updateUser,
    changeUserPassword,
    deleteUser
}