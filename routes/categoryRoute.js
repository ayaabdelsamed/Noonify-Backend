import express from "express";
import { createCategory, deleteCategory, getAllCategories, getSpecificCategory, updateCategory } from "../services/categoryService.js";
import { createCategoryValidator, deleteCategoryValidator, getCategoryValidator, updateCategoryValidator } from "../utils/validators/categoryValidator.js";

const categoryRouter = express.Router();

categoryRouter
    .route("/")
    .post(createCategoryValidator,createCategory)
    .get(getAllCategories);

categoryRouter
    .route("/:id")
    .get(getCategoryValidator,getSpecificCategory)
    .put(updateCategoryValidator,updateCategory)
    .delete(deleteCategoryValidator,deleteCategory);

export default categoryRouter;

