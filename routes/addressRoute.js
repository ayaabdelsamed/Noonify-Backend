import express from "express";
import { allowedTo, protectedRoutes } from "../services/authService.js";
import { addAddress, getLoggedUserAddresses, removeAddress } from "../services/addressService.js";

const addressRouter = express.Router();

addressRouter.use(protectedRoutes, allowedTo('user'));
addressRouter
    .route("/")
    .post(addAddress)
    .get(getLoggedUserAddresses)

addressRouter
    .route("/:addressId")
    .delete(removeAddress);

export default addressRouter;

