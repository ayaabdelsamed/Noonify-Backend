import express from "express";
import { createProductValidator, deleteProductValidator, getProductValidator, updateProductValidator } from "../utils/validators/productValidator.js";
import { createProduct, deleteProduct, getAllProducts, getSpecificProduct, resizeProductImages, updateProduct, uploadProductImages } from "../services/productService.js";
import { allowedTo, protectedRoutes } from "../services/authService.js";
import reviewRouter from "./reviewRoute.js";

const productRouter = express.Router();
//const uploadProductImage = createUploader("products");

// POST   /products/jksghsksksj/reviews
// GET    /products/jksghsksksj/reviews
// GET    /products/jksghsksksj/reviews/4566hhjjoiyy
productRouter.use('/:productId/reviews',reviewRouter)

productRouter
    .route("/")
    .post(protectedRoutes,allowedTo('admin', 'manager'),uploadProductImages,resizeProductImages,createProductValidator, createProduct)
    .get(getAllProducts);

productRouter
    .route("/:id")
    .get(getProductValidator, getSpecificProduct)
    .put(protectedRoutes,allowedTo('admin', 'manager'),uploadProductImages,resizeProductImages,updateProductValidator, updateProduct)
    .delete(protectedRoutes,allowedTo('admin'),deleteProductValidator, deleteProduct)

export default productRouter;

