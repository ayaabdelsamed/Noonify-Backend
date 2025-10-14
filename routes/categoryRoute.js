import express from "express";
import { createCategory, deleteCategory, getAllCategories, getSpecificCategory, resizeImage, updateCategory, uploadCategoryImage } from "../services/categoryService.js";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validators/categoryValidator.js";
import subCategoryRouter from "./subCategoryRoute.js";

const categoryRouter = express.Router();

categoryRouter.use('/:categoryId/subcategories',subCategoryRouter)

categoryRouter
    .route("/")
    .post(uploadCategoryImage,resizeImage,createCategoryValidator,createCategory)
    .get(getAllCategories);

categoryRouter
    .route("/:id")
    .get(getCategoryValidator,getSpecificCategory)
    .put(uploadCategoryImage,resizeImage,updateCategoryValidator,updateCategory)
    .delete(deleteCategoryValidator,deleteCategory);

export default categoryRouter;

