import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Create Brand validation (for admin)
export const createBrandValidator = [
  body("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    ,

  validatorMiddleware,
];

// Get Brand validation
export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid Brand iD format"),
  validatorMiddleware,
];

// Update Brand validation
export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid Brand iD format"),
  validatorMiddleware,
];

// Delete Brand validation
export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid Brand iD format"),
  validatorMiddleware,
];

