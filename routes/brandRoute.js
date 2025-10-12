import express from "express";
import { createBrand, deleteBrand, getAllBrands, getSpecificBrand, updateBrand } from "../services/brandService.js";
import { createBrandValidator, deleteBrandValidator, getBrandValidator, updateBrandValidator } from "../utils/validators/brandValidator.js";

const brandRouter = express.Router();

brandRouter
    .route("/")
    .post(createBrandValidator,createBrand)
    .get(getAllBrands);

brandRouter
    .route("/:id")
    .get(getBrandValidator,getSpecificBrand)
    .put(updateBrandValidator,updateBrand)
    .delete(deleteBrandValidator,deleteBrand);


export default brandRouter;

