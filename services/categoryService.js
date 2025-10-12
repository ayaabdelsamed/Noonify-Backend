import slugify from "slugify"
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import categoryModel from "../models/categoryModel.js";

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private
 */

const createCategory = asyncHandler(async (req, res, next) => {
    const name = req.body.name;
    const category = await categoryModel.create({name, slug: slugify(name)});
    res.status(201).json({message: "success", data: category });
});

/**
 * @desc    Get list of categories
 * @route   GET /api/v1/categories
 * @access  Public
 */

const getAllCategories = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 5;
    const skip = (page -1) * limit
    const categories = await categoryModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ message: "success", results: categories.length, page, data: categories });
});

/**
 * @desc    Get specific category by id
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */

const getSpecificCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findById({ _id: id });
    if (!category) {
        return next(new ApiError(`Category not found for this ${id}`, 404));
    }
    res.status(200).json({ message: "success", data: category });
});

/**
 * @desc    Update specific category 
 * @route   PUT /api/v1/categories/:id
 * @access  Private
 */

const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryModel.findOneAndUpdate({ _id: id }, {...req.body, slug: slugify(name)} ,{
    new: true,
    });
    if (!category) {
        return next(new ApiError(`category not found for this ${id}`, 404));
    }
    
    res.status(200).json({ message: "success", data: category });
});

/**
 * @desc    Delete specific category 
 * @route   DELETE /api/v1/categories/:id
 * @access  Private
 */

const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) {
        return next(new ApiError(`category not found for this ${id}`, 404))
    }
    res.status(200).json({ message: "success" });
});

export{
    createCategory,
    getAllCategories,
    getSpecificCategory,
    updateCategory,
    deleteCategory
}