import express from "express";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validators/productValidator.js";
import { createProduct, deleteProduct, getAllProducts, getSpecificProduct, updateProduct } from "../services/productService.js";

const productRouter = express.Router();
//const uploadProductImage = createUploader("products");

productRouter
    .route("/")
    .post(createProductValidator, createProduct)
    .get(getAllProducts);

productRouter
    .route("/:id")
    .get(getProductValidator, getSpecificProduct)
    .put(updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct)

export default productRouter;

