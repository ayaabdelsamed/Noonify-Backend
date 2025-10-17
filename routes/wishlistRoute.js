import express from "express";
import { allowedTo, protectedRoutes } from "../services/authService.js";
import { addProductToWishlist, getLoggedUserWishlist, removeProductFromWishlist } from "../services/wishlistService.js";

const wishlistRouter = express.Router();

wishlistRouter.use(protectedRoutes, allowedTo('user'));
wishlistRouter
    .route("/")
    .post(addProductToWishlist)
    .get(getLoggedUserWishlist)

wishlistRouter
    .route("/:productId")
    .delete(removeProductFromWishlist);

export default wishlistRouter;

