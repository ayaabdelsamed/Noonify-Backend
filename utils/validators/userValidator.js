import { body, param } from "express-validator";
import slugify from "slugify";
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcryptjs";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import userModel from "../../models/userModel.js";

// Create User validation (for admin)
export const createUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),  

  body("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val)=> 
        userModel.findOne({email: val}).then((user) => {
            if(user){
                return Promise.reject(new Error('Email already in use'));
            }
        })
    ),

  body('password')
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, {req})=>{
      if(password !== req.body.passwordConfirm){
          throw new Error('Password Confirmation incorrect');
      }
      return true;

    }),

  body('passwordConfirm')
    .notEmpty().withMessage("Password confirm required"),

  body('phone')
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage('Invalid phone number only accepted Egu and AS Phone numbers'),

  body('profileImg').optional(),

  body('role').optional(),


  validatorMiddleware,
];

// Get User validation
export const getUserValidator = [
  param("id").isMongoId().withMessage("Invalid User iD format"),
  validatorMiddleware,
];

// Update User validation
export const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid User iD format"),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val)=> 
        userModel.findOne({email: val}).then((user) => {
            if(user){
                return Promise.reject(new Error('Email already in use'));
            }
        })
    ),
  body('phone')
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage('Invalid phone number only accepted Egu and AS Phone numbers'),
  body('profileImg').optional(),
  body('role').optional(),
  validatorMiddleware,
];

// Update User passwordValidation
export const changeUserPasswordValidator = [
  param("id").isMongoId().withMessage("Invalid User iD format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body('password')
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await userModel.findById(req.params.id);
      if(!user){
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if(!isCorrectPassword) {
        throw new Error('Incorrect current password')
      }
      // 2) Verify password confirm
      if(val !== req.body.passwordConfirm){
            throw new Error('Password Confirmation incorrect');
        }
      return true;
    }),
  validatorMiddleware,
];

// Delete User validation
export const deleteUserValidator = [
  param("id").isMongoId().withMessage("Invalid User iD format"),
  validatorMiddleware,
];

