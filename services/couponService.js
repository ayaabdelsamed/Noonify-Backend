import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import couponModel from "../models/couponModel.js";

/**
 * @desc    Create coupon
 * @route   POST /api/v1/coupns
 * @access  Private/Admin-Manager
 */
const createCoupon = createOne(couponModel)

/**
 * @desc    Get list of coupons
 * @route   GET /api/v1/coupons
 * @access  Private/Admin-Manager
 */
const getAllCoupons = getAll(couponModel)

/**
 * @desc    Get specific coupon by id
 * @route   GET /api/v1/coupons/:id
 * @access  Private/Admin-Manager
 */
const getSpecificCoupon = getOne(couponModel)

/**
 * @desc    Update specific coupon 
 * @route   PUT /api/v1/coupons/:id
 * @access  Private/Admin-Manager
 */
const updateCoupon = updateOne(couponModel)

/**
 * @desc    Delete specific coupon 
 * @route   DELETE /api/v1/coupons/:id
 * @access  Private/Admin
 */
const deleteCoupon = deleteOne(couponModel)

export{
    createCoupon,
    getAllCoupons,
    getSpecificCoupon,
    updateCoupon,
    deleteCoupon
}