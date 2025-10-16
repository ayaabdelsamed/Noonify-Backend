import express from "express";
import { activeMe, changeUserPassword, createUser, deleteLoggedUserData, deleteUser, getAllUsers, getLoggedUserData, getSpecificUser, resizeImage, updateLoggedUserData, updateLoggedUserPassword, updateUser, uploadUserImage } from "../services/userService.js";
import { changeUserPasswordValidator, createUserValidator, deleteUserValidator, getUserValidator, updateLoggedUserValidator, updateUserValidator } from "../utils/validators/userValidator.js";
import { allowedTo, protectedRoutes } from "../services/authService.js";

const userRouter = express.Router();

userRouter.put("/activeMe", activeMe);

userRouter.use(protectedRoutes)

userRouter.get("/getMe", getLoggedUserData, getSpecificUser)
userRouter.put("/changeMyPassword", updateLoggedUserPassword)
userRouter.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData)
userRouter.delete("/deleteMe", deleteLoggedUserData)

// Admin
userRouter.use(allowedTo('admin'))
userRouter.put("/changePassword/:id",changeUserPasswordValidator,changeUserPassword)
userRouter
    .route("/")
    .get(getAllUsers)
    .post(uploadUserImage, resizeImage, createUserValidator, createUser);

userRouter
    .route("/:id")
    .get(getUserValidator, getSpecificUser)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

export default userRouter;

