// eslint-disable-next-line import/no-unresolved
import slugify from "slugify"
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import productModel from "../models/productModel.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private
 */

const createProduct = asyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.title)
    
    // if (req.file && req.file.path) {
    //     req.body.image = req.file.path;
    // }
    const product = await productModel.create(req.body);
    res.status(201).json({message: "success", data: product });
});

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */

const getAllProducts = asyncHandler(async (req, res, next) => {
    // Build query
    const documentsCounts = await productModel.countDocuments();
    const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("productModel")
    .limitFields()
    .sort();
    
    // Execute query 
    const {mongooseQuery, paginationResult} = apiFeatures;
    const products = await mongooseQuery;
    res.status(200).json({ message: "success", results: products.length, paginationResult, data: products });
});

/**
 * @desc    Get specific product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */

const getSpecificProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await productModel.findById({ _id: id })
    .populate({ path: 'category', select: 'name -_id'});
    if (!product) {
        return next(new ApiError(`No product for this id ${id}`, 404));
    }
    res.status(200).json({ message: "success", data: product });
});

/**
 * @desc    Update specific product 
 * @route   Put /api/v1/products/:id
 * @access  Public
 */

const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if(req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    // if (req.file && req.file.path) {
    //     req.body.image = req.file.path;
    // }
    const product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
    });
    if (!product) {
        return next(new ApiError(`No product for this id ${id}`, 404));
    }
    res.status(200).json({ message: "success", data: product });
});

/**
 * @desc    Delete specific product 
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete({ _id: id });
    if (!product) {
        return next(new ApiError(`No product for this id ${id}`, 404));
    }
    res.status(200).json({ message: "Product deleted successfully", data: product });
});

export{
    createProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct
}
