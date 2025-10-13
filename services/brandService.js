import brandModel from "../models/brandModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

/**
 * @desc    Create Brand
 * @route   POST /api/v1/categories
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
    createBrand,
    getAllBrands,
    getSpecificBrand,
    updateBrand,
    deleteBrand
}