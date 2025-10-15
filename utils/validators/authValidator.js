import { body } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import userModel from "../../models/userModel.js";

// SignUp
export const signupValidator = [
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

  validatorMiddleware,
];

// LogIn
export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  body('password')
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];

