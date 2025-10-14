import { body, param } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

// Create Category validation (for admin)
export const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),  
  validatorMiddleware,
];

// Get Category validation
export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category iD format"),
  validatorMiddleware,
];

// Update Category validation
export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category iD format"),
      body('name')
        .optional()
        .custom((val, { req }) => {
          req.body.slug = slugify(val);
          return true;
        }),
  validatorMiddleware,
];

// Delete Category validation
export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category iD format"),
  validatorMiddleware,
];

