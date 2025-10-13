import subCategoryModel from "../models/subCategoryModel.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

const setCategoryIdToBody = (req,res,next)=>{
    // Nested route
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
}
const createFileObj = (req,res,next)=>{
    let filterObject = {};
    if(req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
}

/**
 * @desc    Create subCategory
 * @route   POST /api/v1/subCategories
 * @access  Private
 */
const createSubCategory = createOne(subCategoryModel)


/**
 * @desc    Get list of subcategories
 * @route   GET /api/v1/subcategories
 * @access  Public
 */
const getAllSubCategories = getAll(subCategoryModel)

/**
 * @desc    Get specific subcategory by id
 * @route   GET /api/v1/subcategories/:id
 * @access  Public
 */
const getSubCategory = getOne(subCategoryModel)

/**
 * @desc    Update specific subcategory 
 * @route   PUT /api/v1/subcategories/:id
 * @access  Private
 */
const updateSubCategory = updateOne(subCategoryModel)

/**
 * @desc    Delete specific subcategory 
 * @route   DELETE /api/v1/subcategories/:id
 * @access  Private
 */
const deleteSubCategory = deleteOne(subCategoryModel)


export{
    setCategoryIdToBody,
    createSubCategory,
    createFileObj,
    getAllSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory
}