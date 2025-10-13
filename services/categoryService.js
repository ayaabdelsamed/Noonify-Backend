import categoryModel from "../models/categoryModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

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
    createCategory,
    getAllCategories,
    getSpecificCategory,
    updateCategory,
    deleteCategory
}