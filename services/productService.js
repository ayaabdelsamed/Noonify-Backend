import productModel from "../models/productModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private
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
 * @access  Public
 */
const updateProduct = updateOne(productModel)

/**
 * @desc    Delete specific product 
 * @route   DELETE /api/v1/products/:id
 * @access  Private
 */
const deleteProduct = deleteOne(productModel)

export{
    createProduct,
    getAllProducts,
    getSpecificProduct,
    updateProduct,
    deleteProduct
}
