import express from "express";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validators/productValidator.js";
import { createProduct, deleteProduct, getAllProducts, getSpecificProduct, resizeProductImages, updateProduct, uploadProductImages } from "../services/productService.js";

const productRouter = express.Router();
//const uploadProductImage = createUploader("products");

productRouter
    .route("/")
    .post(uploadProductImages,resizeProductImages,createProductValidator, createProduct)
    .get(getAllProducts);

productRouter
    .route("/:id")
    .get(getProductValidator, getSpecificProduct)
    .put(uploadProductImages,resizeProductImages,updateProductValidator, updateProduct)
    .delete(deleteProductValidator, deleteProduct)

export default productRouter;

