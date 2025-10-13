import slugify from "slugify"
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import subCategoryModel from "../models/subCategoryModel.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

/**
 * @desc    Create subCategory
 * @route   POST /api/v1/subCategories
 * @access  Private
 */

const setCategoryIdToBody = (req,res,next)=>{
    // Nested route
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
}

const createSubCategory = asyncHandler(async (req, res, next) => {
    const {name, category} = req.body;
    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name),
        category,
    });
    res.status(201).json({message: "success", data: subCategory });
});

const createFileObj = (req,res,next)=>{
    let filterObject = {};
    if(req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
}

/**
 * @desc    Get list of subcategories
 * @route   GET /api/v1/subcategories
 * @access  Public
 */

const getAllSubCategories = asyncHandler(async (req, res, next) => {
    // Build query
    const documentsCounts = await subCategoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();
    
    // Execute query 
    const {mongooseQuery, paginationResult} = apiFeatures;
    const subCategories = await mongooseQuery;
    res.status(200).json({ message: "success", results: subCategories.length, paginationResult, data: subCategories });
});

/**
 * @desc    Get specific subcategory by id
 * @route   GET /api/v1/subcategories/:id
 * @access  Public
 */

const getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findById({ _id: id })
    //.populate({path: 'category', select: 'name -_id'});;
    if (!subCategory) {
        return next(new ApiError(`SubCategory not found for this ${id}`, 404));
    }
    res.status(200).json({ message: "success", data: subCategory });
});

/**
 * @desc    Update specific subcategory 
 * @route   PUT /api/v1/subcategories/:id
 * @access  Private
 */

const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const subCategory = await subCategoryModel.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name), category },
        { new: true }
    );
    if (!subCategory) {
        return next(new ApiError(`SubCategory not found for this ${id}`, 404));
    }
    
    res.status(200).json({ message: "success", data: subCategory });
});

/**
 * @desc    Delete specific subcategory 
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Private
 */

const deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await subCategoryModel.findByIdAndDelete(id);
    if (!subCategory) {
        return next(new ApiError(`SubCategory not found for this ${id}`, 404))
    }
    res.status(200).json({ message: "success" });
});

export{
    setCategoryIdToBody,
    createSubCategory,
    createFileObj,
    getAllSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}