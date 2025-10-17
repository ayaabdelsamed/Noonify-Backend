import { body, check, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import reviewModel from "../../models/reviewModel.js";

// Create Review validation (for admin)
export const createReviewValidator = [
  body("title").optional(),

  body("ratings")
    .notEmpty()
    .withMessage("Ratings value required")
    .isFloat({ min:1 , max: 5})
    .withMessage("Ratings value must be between 1 to 5"),
    body("user").isMongoId().withMessage("Invalid Review iD format"),
    body("product").isMongoId().withMessage("Invalid Review iD format")
    .custom((val, { req }) =>
      // Check if logged user create review before
      reviewModel.findOne({ user: req.user._id, product: req.body.product}).then((review) => {
        if(review){
          return Promise.reject(new Error("You already created a review before"))
        }
      })

    ),

  validatorMiddleware,
];

// Get Review validation
export const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review iD format"),
  validatorMiddleware,
];

// Update Review validation
export const updateReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review iD format")
  .custom((val, { req }) => 
    // Check review ownership before update
    reviewModel.findById(val).then((review) => {
      if(!review){
          return Promise.reject(new Error(`There is no review with id ${val}`));
      }
      if(review.user._id.toString() !== req.user._id.toString()){
          return Promise.reject(new Error(`You are not allowed to perform this action`));
      };
    })
  ),
  validatorMiddleware,
];

// Delete Review validation
export const deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review iD format")
  .custom((val, { req }) => {
    // Check review ownership before delete
    if(req.user.role === 'user') {
      return reviewModel.findById(val).then((review) => {
        if(!review){
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        if(review.user._id.toString() !== req.user._id.toString()){
          return Promise.reject(new Error(`You are not allowed to perform this action`));
        };
      });
    }
    return true;
  }),
  validatorMiddleware,
];

