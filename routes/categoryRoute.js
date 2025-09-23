import express from "express";
import { createCategory, deleteCategory, getAllCategories, getSpecificCategory, updateCategory } from "../services/categoryService.js";

const categoryRouter = express.Router();

categoryRouter
    .route("/")
    .post(createCategory)
    .get(getAllCategories);

categoryRouter
    .route("/:id")
    .get(getSpecificCategory)
    .put(updateCategory)
    .delete(deleteCategory);

export default categoryRouter;

