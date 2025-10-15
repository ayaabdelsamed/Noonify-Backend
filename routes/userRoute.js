import express from "express";
import { changeUserPassword, createUser, deleteUser, getAllUsers, getSpecificUser, resizeImage, updateUser, uploadUserImage } from "../services/userService.js";
import { changeUserPasswordValidator, createUserValidator, deleteUserValidator, getUserValidator, updateUserValidator } from "../utils/validators/userValidator.js";
import { allowedTo, protectedRoutes } from "../services/authService.js";

const userRouter = express.Router();

userRouter.put("/changePassword/:id",changeUserPasswordValidator,changeUserPassword)

userRouter
    .route("/")
    .post(protectedRoutes,allowedTo('admin'),uploadUserImage,resizeImage,createUserValidator,createUser)
    .get(protectedRoutes,allowedTo('admin'),getAllUsers);

userRouter
    .route("/:id")
    .get(protectedRoutes,allowedTo('admin'),getUserValidator,getSpecificUser)
    .put(protectedRoutes,allowedTo('admin'),uploadUserImage,resizeImage,updateUserValidator,updateUser)
    .delete(protectedRoutes,allowedTo('admin'),deleteUserValidator,deleteUser);

export default userRouter;

