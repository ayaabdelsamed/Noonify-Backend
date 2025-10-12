import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Create SubCategory validation (for admin)
export const createSubCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 3 })
    .withMessage("Too short SubCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long SubCategory name"),

  body("category")
    .notEmpty()
    .withMessage("SubCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid SubCategory ID format"),  

  validatorMiddleware,
];

// Get SubCategory validation
export const getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid SubCategory iD format"),
  validatorMiddleware,
];

// Update SubCategory validation
export const updateSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid SubCategory iD format"),
  validatorMiddleware,
];

// Delete SubCategory validation
export const deleteSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid SubCategory iD format"),
  validatorMiddleware,
];

