import slugify from "slugify"
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import brandModel from "../models/brandModel.js";
import { ApiFeatures } from "../utils/apiFeatures.js";

/**
 * @desc    Create Brand
 * @route   POST /api/v1/categories
 * @access  Private
 */

const createBrand = asyncHandler(async (req, res, next) => {
    const name = req.body.name;
    const brand = await brandModel.create({name, slug: slugify(name)});
    res.status(201).json({message: "success", data: brand });
});

/**
 * @desc    Get list of brands
 * @route   GET /api/v1/brands
 * @access  Public
 */

const getAllBrands = asyncHandler(async (req, res, next) => {
        // Build query
        const documentsCounts = await brandModel.countDocuments();
        const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
        .paginate(documentsCounts)
        .filter()
        .search()
        .limitFields()
        .sort();

        // Execute query 
    const {mongooseQuery, paginationResult} = apiFeatures;
    const brands = await mongooseQuery;
    res.status(200).json({ message: "success", results: brands.length, paginationResult, data: brands });
});

/**
 * @desc    Get specific brand by id
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */

const getSpecificBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findById({ _id: id });
    if (!brand) {
        return next(new ApiError(`Brand not found for this ${id}`, 404));
    }
    res.status(200).json({ message: "success", data: brand });
});

/**
 * @desc    Update specific brand 
 * @route   PUT /api/v1/brands/:id
 * @access  Private
 */

const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand = await brandModel.findOneAndUpdate({ _id: id }, {...req.body, slug: slugify(name)} ,{
    new: true,
    });
    if (!brand) {
        return next(new ApiError(`Brand not found for this ${id}`, 404));
    }
    
    res.status(200).json({ message: "success", data: brand });
});

/**
 * @desc    Delete specific brand 
 * @route   DELETE /api/v1/brands/:id
 * @access  Private
 */

const deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brandModel.findByIdAndDelete(id);
    if (!brand) {
        return next(new ApiError(`Brand not found for this ${id}`, 404))
    }
    res.status(200).json({ message: "success" });
});

export{
    createBrand,
    getAllBrands,
    getSpecificBrand,
    updateBrand,
    deleteBrand
}