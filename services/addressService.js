import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";


/**
 * @desc    Add address to user addresses list
 * @route   POST /api/v1/addresses
 * @access  Protected/User
 */
const addAddress = asyncHandler(async (req, res, next) => {
    // $addToSet: add address object to user addresses array if addressId not exist
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { addresses: req.body } },
        { new: true });

    res.status(200).json({ message: "success", data: user.addresses });
})

/**
 * @desc    Remove address from user addresses list
 * @route   DELETE /api/v1/addresses/:addressId
 * @access  Protected/User
 */
const removeAddress = asyncHandler(async (req, res, next) => {
    // $pull: remove address object from user addresses array if addressId exist
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { addresses: { _id: req.params.addressId} } },
        { new: true });

    res.status(200).json({ message: "success", data: user.addresses });
})

/**
 * @desc    Get logged user addresses list
 * @route   Get /api/v1/addresses
 * @access  Protected/User
 */
const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate('addresses');

    res.status(200).json({ message: "success", results: user.addresses.length ,data: user.addresses });
})

export{
    addAddress,
    removeAddress,
    getLoggedUserAddresses
}