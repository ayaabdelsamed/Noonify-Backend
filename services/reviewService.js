import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import reviewModel from "../models/reviewModel.js";

const setProductIdAndUserIdToBody = (req,res,next)=>{
    // Nested route (Create)
    if(!req.body.product) req.body.product = req.params.productId;
    if(!req.body.user) req.body.user = req.user._id;
    next();
}

// Nested route (Create)
// GET /api/v1/products/:productId/reviews
const createFileObj = (req,res,next)=>{
    let filterObject = {};
    if(req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
}

/**
 * @desc    Create review
 * @route   POST /api/v1/reviews
 * @access  Private/Protect/User
 */
const createReview = createOne(reviewModel)

/**
 * @desc    Get list of Reviews
 * @route   GET /api/v1/reviews
 * @access  Public
 */
const getAllReviews = getAll(reviewModel)

/**
 * @desc    Get specific review by id
 * @route   GET /api/v1/reviews/:id
 * @access  Public
 */
const getSpecificReview = getOne(reviewModel)

/**
 * @desc    Update specific review 
 * @route   PUT /api/v1/reviews/:id
 * @access  Private//Protect/User
 */
const updateReview = updateOne(reviewModel)

/**
 * @desc    Delete specific Review 
 * @route   DELETE /api/v1/Reviews/:id
 * @access  Private//Protect/User-Admin-Manager
 */
const deleteReview = deleteOne(reviewModel)


export{
    setProductIdAndUserIdToBody,
    createFileObj,
    createReview,
    getAllReviews,
    getSpecificReview,
    updateReview,
    deleteReview
}