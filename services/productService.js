// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-extraneous-dependencies
import asyncHandler from "express-async-handler";
// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";
import productModel from "../models/productModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import { uploadMixOfImages } from "../middlewares/uploadImageMiddleware.js";

const uploadProductImages = uploadMixOfImages([
    {
        name: "imageCover",
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    }
])

const resizeProductImages = asyncHandler( async(req, res, next) => {
    //console.log(req.files);
    // 1- Image processing for imageCover
    if(req.files.imageCover) {
        const imageFileCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        
            await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95})
            .toFile(`uploads/products/${imageFileCoverName}`);
        
            // Save image into our db
            req.body.imageCover = imageFileCoverName;
    }
    // 2- Image processing for images
    if(req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async(img, index) => {
            const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        
            await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95})
            .toFile(`uploads/products/${imageName}`);
        
            // Save image into our db
            req.body.images.push(imageName);
        }));
        next();
    }
});

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private/Admin-Manager
 */
const createProduct = createOne(productModel)

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */
const getAllProducts = getAll(productModel ,"productModel")

/**
 * @desc    Get specific product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
const getSpecificProduct = getOne(productModel)

/**
 * @desc    Update specific product 
 * @route   Put /api/v1/products/:id
 * @access  Private/Admin-Manager
 */
const updateProduct = updateOne(productModel)

/**
 * @desc    Delete specific product 
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProduct = deleteOne(productModel)

export{
    uploadProductImages,
    resizeProductImages,
    createProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct
}
