import asyncHandler from "express-async-handler";
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";

import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import brandModel from "../models/brandModel.js";

// Upload single image
const uploadBrandImage = uploadSingleImage('image');

// Image processing
const resizeImage = asyncHandler(async (req, res, next) =>{
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95})
    .toFile(`uploads/brands/${filename}`);

    // Save image into our db
    req.body.image = filename;

    next();
})

/**
 * @desc    Create Brand
 * @route   POST /api/v1/brands
 * @access  Private
 */
const createBrand = createOne(brandModel)

/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */
const getAllBrands = getAll(brandModel)

/**
 * @desc    Get specific brand by id
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
const getSpecificBrand = getOne(brandModel)

/**
 * @desc    Update specific brand 
 * @route   PUT /api/v1/brands/:id
 * @access  Private
 */
const updateBrand = updateOne(brandModel)

/**
 * @desc    Delete specific brand 
 * @route   DELETE /api/v1/brands/:id
 * @access  Private
 */
const deleteBrand = deleteOne(brandModel)


export{
    uploadBrandImage,
    resizeImage,
    createBrand,
    getAllBrands,
    getSpecificBrand,
    updateBrand,
    deleteBrand
}