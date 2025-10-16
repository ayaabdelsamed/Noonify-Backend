import express from "express";
import { forgotPaasword, logIn, resetPassword, signUp, verifyPassResetCode } from "../services/authService.js";
import {signupValidator,loginValidator} from "../utils/validators/authValidator.js";

const authRouter = express.Router();


authRouter.post("/signup", signupValidator, signUp)
authRouter.post("/login", loginValidator, logIn)
authRouter.post("/forgotPaasword", forgotPaasword)
authRouter.post("/verifyResetCode", verifyPassResetCode)
authRouter.put("/resetPassword", resetPassword)

export default authRouter;

