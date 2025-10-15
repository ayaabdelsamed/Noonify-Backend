import express from "express";
import { logIn, signUp } from "../services/authService.js";
import {signupValidator,loginValidator} from "../utils/validators/authValidator.js";

const authRouter = express.Router();


authRouter.route("/signup").post(signupValidator,signUp)
authRouter.route("/login").post(loginValidator,logIn)

// authRouter
//     .route("/:id")
//     .get(getauthValidator,getSpecificauth)
//     .put(uploadauthImage,resizeImage,updateauthValidator,updateauth)
//     .delete(deleteauthValidator,deleteauth);


export default authRouter;

