import express from "express";
import { createBrand, deleteBrand, getAllBrands, getSpecificBrand, resizeImage, updateBrand, uploadBrandImage } from "../services/brandService.js";
import { createBrandValidator, deleteBrandValidator, getBrandValidator, updateBrandValidator } from "../utils/validators/brandValidator.js";
import { allowedTo, protectedRoutes } from "../services/authService.js";

const brandRouter = express.Router();

brandRouter
    .route("/")
    .post(protectedRoutes,allowedTo('admin', 'manager'),uploadBrandImage,resizeImage,createBrandValidator,createBrand)
    .get(getAllBrands);

brandRouter
    .route("/:id")
    .get(getBrandValidator,getSpecificBrand)
    .put(protectedRoutes,allowedTo('admin', 'manager'),uploadBrandImage,resizeImage,updateBrandValidator,updateBrand)
    .delete(protectedRoutes,allowedTo('admin'),deleteBrandValidator,deleteBrand);


export default brandRouter;

