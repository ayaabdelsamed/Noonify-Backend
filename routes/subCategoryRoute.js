import express from "express";
import { createFileObj, createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategory, setCategoryIdToBody, updateSubCategory } from "../services/subCategoryService.js";
import { createSubCategoryValidator, deleteSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator } from "../utils/validators/subCategoryValidator..js";


// mergeParams: Allow us to access parameters on other routers
const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
    .route("/")
    .post(setCategoryIdToBody,createSubCategoryValidator,createSubCategory)
    .get(createFileObj,getAllSubCategories);

subCategoryRouter
    .route("/:id")
    .get(getSubCategoryValidator,getSubCategory)
    .put(updateSubCategoryValidator,updateSubCategory)
    .delete(deleteSubCategoryValidator,deleteSubCategory);

export default subCategoryRouter;

