import express from "express";
import { changeUserPassword, createUser, deleteUser, getAllUsers, getSpecificUser, resizeImage, updateUser, uploadUserImage } from "../services/userService.js";
import { changeUserPasswordValidator, createUserValidator, deleteUserValidator, getUserValidator, updateUserValidator } from "../utils/validators/userValidator.js";

const userRouter = express.Router();

userRouter.put("/changePassword/:id",changeUserPasswordValidator,changeUserPassword)

userRouter
    .route("/")
    .post(uploadUserImage,resizeImage,createUserValidator,createUser)
    .get(getAllUsers);

userRouter
    .route("/:id")
    .get(getUserValidator,getSpecificUser)
    .put(uploadUserImage,resizeImage,updateUserValidator,updateUser)
    .delete(deleteUserValidator,deleteUser);


export default userRouter;

