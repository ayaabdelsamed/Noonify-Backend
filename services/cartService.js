import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import couponModel from "../models/couponModel.js";

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += (item.quantity * item.price);
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};

/**
 * @desc    Add product to cart
 * @route   POST /api/v1/cart
 * @access  Private/User
 */
const addProductToCart = asyncHandler(async (req, res, next) => {
    const {productId, color } = req.body;
    const product = await productModel.findById(productId)
    // 1) Get cart for logged user
    let cart = await cartModel.findOne({ user: req.user._id });

    if(!cart) {
        // Create cart for logged user with product
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }],
        })
    }else {
        // Product exist in cart, update product quantity
        const productIndex = cart.cartItems.findIndex( 
            item => item.product.toString() === productId && item.color === color
        );
        if(productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity +=1;
            cart.cartItems[productIndex] = cartItem;
        }else {
        // Product not exist in cart, push product to cartItems array
        cart.cartItems.push({ product: productId, color, price: product.price });
        }
    }

    // Calculate total cart price
    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({ message: "success", numOfCartItems: cart.cartItems.length, data: cart});
});

/**
 * @desc    Get logged user cart
 * @route   GET /api/v1/cart
 * @access  Private/User
 */
const getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });

    if(!cart) {
        return next(new ApiError(`There is no cart for this user id : ${req.user._id}`, 404));
    }
    res.status(200).json({ message: "success", numOfCartItems: cart.cartItems.length, data: cart});
});

/**
 * @desc    Remove specific cart item
 * @route   DELETE /api/v1/cart/:itemId
 * @access  Private/User
 */
const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } },
        },
        { new: true }
    );

    calcTotalCartPrice(cart);
    cart.save();

    res.status(200).json({ message: "success", numOfCartItems: cart.cartItems.length, data: cart});
});

/**
 * @desc    Clear logged user cart
 * @route   GET /api/v1/cart
 * @access  Private/User
 */
const clearCart = asyncHandler(async (req, res, next) => {
    await cartModel.findOneAndDelete({ user: req.user._id });

    res.status(204).json({ message: "success"});
});

/**
 * @desc    Update specific cart item quantity
 * @route   PUT /api/v1/cart/:itemId
 * @access  Private/User
 */
const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity }= req.body;
    const cart = await cartModel.findOne({ user: req.user._id });
    if(!cart){
        return next(new ApiError(`There is no cart for this user id : ${req.user._id}`, 404));
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId);
    if(itemIndex > -1){
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    } else{
        return next(new ApiError(`There is no item for this id: ${req.params.itemId}`, 404));
    }

    calcTotalCartPrice(cart);
    await cart.save();

    res.status(200).json({ message: "success", numOfCartItems: cart.cartItems.length, data: cart});
});

/**
 * @desc    Apply coupon on logged user cart
 * @route   PUT /api/v1/cart/applyCoupon
 * @access  Private/User
 */
const applyCoupon = asyncHandler(async (req, res, next) => {
    // 1) Get coupon based on coupon name
    const coupon = await couponModel.findOne({ 
        name: req.body.coupon,
        expire: { $gt: Date.now() },
    });

    if(!coupon){
        return next(new ApiError('Coupon is invalid or expired'));
    }

    // 2) Get Logged user cart to get total cart price
    const cart = await cartModel.findOne({ user: req.user._id });
    const totalPrice = cart.totalCartPrice;

    // 3) Calculate price after priceAfterDiscount
    const totalPriceAfterDiscount = 
        (totalPrice - ( totalPrice * coupon.discount ) / 100 ).toFixed(2);
    
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({ message: "success", numOfCartItems: cart.cartItems.length, data: cart});
});

export{
    addProductToCart,
    getLoggedUserCart,
    removeSpecificCartItem,
    clearCart,
    updateCartItemQuantity,
    applyCoupon
}