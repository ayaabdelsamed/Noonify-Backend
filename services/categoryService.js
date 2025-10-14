// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from "express-async-handler";

import categoryModel from "../models/categoryModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js"

// Upload single image
const uploadCategoryImage = uploadSingleImage('image');

// Image processing
const resizeImage = asyncHandler(async (req, res, next) =>{
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95})
    .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;

    next();
})

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private
 */
const createCategory = createOne(categoryModel)

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
const getAllCategories = getAll(categoryModel)

/**
 * @desc    Get specific category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
const getSpecificCategory = getOne(categoryModel)

/**
 * @desc    Update specific category 
 * @route   PUT /api/v1/categories/:id
 * @access  Private
 */
const updateCategory = updateOne(categoryModel)

/**
 * @desc    Delete specific category 
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */
const deleteCategory = deleteOne(categoryModel)

export{
    uploadCategoryImage,
    resizeImage,
    createCategory,
    getAllCategories,
    getSpecificCategory,
    updateCategory,
    deleteCategory
}