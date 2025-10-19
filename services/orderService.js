import dotenv from "dotenv";
// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { getAll, getOne } from "./handlersFactory.js";

dotenv.config({ path: "./config.env" });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

/**
 * @desc    Get checkout session from stripe and send it as response
 * @route   GET /api/orders/checkout-session/:cartId
 * @access  Private/User
 */
const checkoutSession = asyncHandler(async (req, res, next) => {
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

    // 3) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
        {
            price_data: {
                currency: "egp",
                unit_amount: Math.round(totalOrderPrice * 100),
                product_data: { name: "Order total" },
            },
            quantity: 1,
        },
    ],
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders/card/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
    });

    // 4) Send session to response
    res.status(200).json({ message: "success", session });
});

const webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
    event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
    );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        console.log("Create Order Here....");
    }

    res.status(200).json({ received: true });
});

// Fallback confirmation endpoint in case webhooks are not configured/reachable
const confirmCardPayment = asyncHandler(async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  if (session.payment_status === "paid") {
    // هنا تقدري تخلقي الأوردر فعلاً من بيانات السيشن لو عايزة
    res.status(200).json({
      message: "Payment successful",
      session,
    });
  } else {
    res.status(400).json({
      message: "Payment failed or not completed yet",
      session,
    });
  }
});



export {
    createCashOrder,
    filterOrderForLoggedUser,
    findAllOrders,
    findSpecificOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    checkoutSession,
    webhookCheckout,
    confirmCardPayment
};
