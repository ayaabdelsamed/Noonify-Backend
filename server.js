import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import dbConnection from "./config/database.js";
import categoryRouter from "./routes/categoryRoute.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/errorMiddleware.js";
import subCategoryRouter from "./routes/subCategoryRoute.js";
import brandRouter from "./routes/brandRoute.js";

dotenv.config({ path: 'config.env'})

// Connect with db
dbConnection()

const app = express();
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}
// mount Routes
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);


app.use((req,res,next)=>{
    next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400))
})

// Global error handling middleware for express
app.use(globalError);

const {PORT} = process.env;

const server = app.listen(PORT, () => console.log(`App running on port ${PORT}`));



/**
 * Gracefully shutdown the server
 * @param {string} signal - The signal that triggered the shutdown
 */
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  }
};

/**
 * Handle unexpected errors
 * @param {Error} error - The error that occurred
 */
const unexpectedErrorHandler = (error) => {
  console.log(error);
  if (server) {
    console.log("Server is shutting down due to unexpected error...");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

// Handle errors that occur within promises but weren't caught
process.on("unhandledRejection", unexpectedErrorHandler);

// Handle errors that happen synchronously outside Express
process.on("uncaughtException", unexpectedErrorHandler);

// Handle SIGTERM signal (used by container systems)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle SIGINT signal (Ctrl+C)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
