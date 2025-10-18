import express from "express";
import { createCoupon, deleteCoupon, getAllCoupons, getSpecificCoupon, updateCoupon } from "../services/couponService.js";
import { allowedTo, protectedRoutes } from "../services/authService.js";

const couponRouter = express.Router();

couponRouter.use(protectedRoutes, allowedTo('admin', 'manager'),)
couponRouter
    .route("/")
    .post(createCoupon)
    .get(getAllCoupons);

couponRouter
    .route("/:id")
    .get(getSpecificCoupon)   
    .put(updateCoupon)     
    .delete(deleteCoupon)

export default couponRouter;