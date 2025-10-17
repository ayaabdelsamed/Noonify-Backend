import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";


/**
 * @desc    Add product to wishlist
 * @route   POST /api/v1/wishlist
 * @access  Protected/User
 */
const addProductToWishlist = asyncHandler(async (req, res, next) => {
    // $addToSet: add productId to wishlist array if productId not exist
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: req.body.productId } },
        { new: true });

    res.status(200).json({ message: "success", data: user.wishlist });
})

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/v1/wishlist/:productId
 * @access  Protected/User
 */
const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    // $pull: remove productId from wishlist array if productId exist
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: req.params.productId } },
        { new: true });

    res.status(200).json({ message: "success", data: user.wishlist });
})

/**
 * @desc    Get logged user wishlist
 * @route   Get /api/v1/wishlist
 * @access  Protected/User
 */
const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate('wishlist');

    res.status(200).json({ message: "success", results: user.wishlist.length ,data: user.wishlist });
})

export{
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWishlist
}