import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { getAll, getOne } from "./handlersFactory.js";


/**
 * @desc    Create cash order
 * @route   POST /api/v1/orders/cartId
 * @access  Private/User
 */
const createCashOrder = asyncHandler(async (req, res, next) => {
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart depend on cartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart){
        return next(new ApiError(`There is no such cart with id: ${req.params.cartId}`, 404));
    } 

    // 2) Get order price depend on cart price "check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount 
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) Create order with default paymentMethodType cash
    const order = await orderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice,
    });

    // 4) After creating order, decrement product quantity, increment product sold
    if(order){
        const bulkOption = cart.cartItems.map((item) => ({ // بتنفذ اكتر من اوبريشن في كوماند واحد
        updateOne: {
            filter: { _id: item.product }, // return product
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
    }));
    await productModel.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await cartModel.findByIdAndDelete(req.params.cartId);
    }

    res.status(201).json({ message: "success", data: order });
});

const filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if(req.user.role === 'user') 
        req.filterObj = { user: req.user._id };
    next();
});

/**
 * @desc    Get all orders
 * @route   POST /api/v1/orders
 * @access  Private/User-Admin-Manager
 */
const findAllOrders = getAll(orderModel);

/**
 * @desc    Get all orders
 * @route   POST /api/v1/orders
 * @access  Private/User-Admin-Manager
 */
const findSpecificOrder = getOne(orderModel);

/**
 * @desc    Update order paid status to paid
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Private/Admin-Manager
 */
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if(!order){
        return next(new ApiError(`There is no such a order with this id: ${req.params.id}`, 404));
    }

    // Update order to paid
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ message: "success", data: updatedOrder });
});


/**
 * @desc    Update order delivered status
 * @route   PUT /api/v1/orders/:id/deliver
 * @access  Private/Admin-Manager
 */
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);
    if(!order){
        return next(new ApiError(`There is no such a order with this id: ${req.params.id}`, 404));
    }

    // Update order to paid
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ message: "success", data: updatedOrder });
});


export {
    createCashOrder,
    filterOrderForLoggedUser,
    findAllOrders,
    findSpecificOrder,
    updateOrderToPaid,
    updateOrderToDelivered
};
