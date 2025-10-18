import addressRouter from "./addressRoute.js";
import authRouter from "./authRoute.js";
import brandRouter from "./brandRoute.js";
import categoryRouter from "./categoryRoute.js";
import couponRouter from "./couponRoute.js";
import productRouter from "./productRoute.js";
import reviewRouter from "./reviewRoute.js";
import subCategoryRouter from "./subCategoryRoute.js";
import userRouter from "./userRoute.js";
import wishlistRouter from "./wishlistRoute.js";

// Mount Routes
const mountRoutes = (app) => {
    app.use("/api/v1/categories", categoryRouter);
    app.use("/api/v1/subcategories", subCategoryRouter);
    app.use("/api/v1/brands", brandRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/reviews", reviewRouter);
    app.use("/api/v1/wishlist", wishlistRouter);
    app.use("/api/v1/addresses", addressRouter);
    app.use("/api/v1/coupons", couponRouter);
}

export default mountRoutes;