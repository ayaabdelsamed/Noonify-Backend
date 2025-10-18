import express from "express";
import { allowedTo, protectedRoutes } from "../services/authService.js";
import { addProductToCart, applyCoupon, clearCart, getLoggedUserCart, removeSpecificCartItem, updateCartItemQuantity } from "../services/cartService.js";

const cartRouter = express.Router();

cartRouter.use(protectedRoutes,allowedTo('user'));
cartRouter
    .route("/")
    .post(addProductToCart)
    .get(getLoggedUserCart)
    .delete(clearCart);

cartRouter.put('/applyCoupon', applyCoupon)

cartRouter
    .route("/:itemId")
    .put(updateCartItemQuantity)
    .delete(removeSpecificCartItem);

export default cartRouter;

