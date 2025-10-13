import { body, param } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import categoryModel from "../../models/categoryModel.js";
import subCategoryModel from "../../models/subCategoryModel.js";

// Create product validation (for admin)
export const createProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("Product required")
    .isLength({ min: 3})
    .withMessage("Must be at least 3 chars")
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),

  body("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),

  body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  body("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),  

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isFloat({ max: 99999999999999 })
    .withMessage("Too long price"),

  body("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if( parseFloat(req.body.price) <= value ){
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

    body("colors")
    .optional()
    .isArray()
    .withMessage("AvailableColors should be array of string"),

    body("imageCover")
    .notEmpty()
    .withMessage("Product imageCover is required"),

    body("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),

    body("category")
    .notEmpty()
    .withMessage("Product must be belong to category")
    .isMongoId()
    .withMessage("Invalid Id formate")
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((category) => {
        if(!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
    })
  ),

    body("subCategories")
    .optional()
    .isArray()
    .withMessage("Invalid Id formate")
    .custom((subCategoriesIds) =>
      subCategoryModel.find({_id: { $exists: true, $in: subCategoriesIds }}).then(
        (result) => {
          if( result.length < 1 || result.length !== subCategoriesIds.length) {
            return Promise.reject( new Error(`Invalid subCategories Ids`));
          }
        }
      )
  )
  .custom((val, { req }) => 
    subCategoryModel.find({ category: req.body.category }).then(
      ( subCategories ) =>{
      const subCategoriesIdsInDB = [];
      subCategories.forEach((subCategory) => {
        subCategoriesIdsInDB.push(subCategory._id.toString());
      });
      // check if subcategories ids in db include subcategories in req.body (true/false)
      const checker = (target, arr) => target.every((v) => arr.includes(v))
      if(!checker(val, subCategoriesIdsInDB)){
        return Promise.reject( new Error(`subCategories not belong to category`));
      }
    })

  ),

    body("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id formate"),

    body("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),

    body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

// Get product validation
export const getProductValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

// Update product validation (for admin)
export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

// Delete product validation (for admin)
export const deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

