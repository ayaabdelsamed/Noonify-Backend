import express from "express";
import { allowedTo, protectedRoutes } from "../services/authService.js";
import { createReviewValidator, deleteReviewValidator, getReviewValidator, updateReviewValidator } from "../utils/validators/reviewValidator.js";
import { createFileObj, createReview, deleteReview, getAllReviews, getSpecificReview, setProductIdAndUserIdToBody, updateReview } from "../services/reviewService.js";

const reviewRouter = express.Router({ mergeParams: true});

reviewRouter
    .route("/")
    .post(protectedRoutes,allowedTo('user'), setProductIdAndUserIdToBody, createReviewValidator, createReview)
    .get(createFileObj, getAllReviews);

reviewRouter
    .route("/:id")
    .get(getReviewValidator, getSpecificReview)
    .put(protectedRoutes,allowedTo('user'), updateReviewValidator, updateReview)
    .delete(protectedRoutes,allowedTo('user','manager','admin'), deleteReviewValidator, deleteReview);


export default reviewRouter;

