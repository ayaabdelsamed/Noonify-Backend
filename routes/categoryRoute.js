import express from "express";
import { getAllCategories } from "../services/categoryService.js";

const categoryRouter = express.Router();

categoryRouter
    .route("/")
    .get(getAllCategories);

export default categoryRouter;

