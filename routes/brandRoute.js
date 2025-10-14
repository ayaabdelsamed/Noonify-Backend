import express from "express";
import { createBrand, deleteBrand, getAllBrands, getSpecificBrand, resizeImage, updateBrand, uploadBrandImage } from "../services/brandService.js";
import { createBrandValidator, deleteBrandValidator, getBrandValidator, updateBrandValidator } from "../utils/validators/brandValidator.js";

const brandRouter = express.Router();

brandRouter
    .route("/")
    .post(uploadBrandImage,resizeImage,createBrandValidator,createBrand)
    .get(getAllBrands);

brandRouter
    .route("/:id")
    .get(getBrandValidator,getSpecificBrand)
    .put(uploadBrandImage,resizeImage,updateBrandValidator,updateBrand)
    .delete(deleteBrandValidator,deleteBrand);


export default brandRouter;

