import path from 'path';
import { fileURLToPath } from "url";

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import qs from "qs";
import cors from "cors"
import compression from "compression";
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";
import hpp from 'hpp';

import dbConnection from "./config/database.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/errorMiddleware.js";
import mountRoutes from './routes/index.js';
import { webhookCheckout } from './services/orderService.js';
import csrfProtection from './middlewares/csrfProtection.js';

dotenv.config({ path: 'config.env'})

// Connect with db
dbConnection()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable other domains to access your application
const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Compress all response
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Middlewares
app.use(express.json());

app.use(express.static(path.join(__dirname,'uploads')));
app.set("query parser", (str) => qs.parse(str));

app.use(cookieParser());


app.get("/api/v1/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});



if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per 'window' (here, per 15 mins)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 15,
  message: "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api",limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({whitelist: ['price', 'sold', 'quantity', 'ratingsQuantity', 'ratingsAverage'] }));

// Mount Routes
mountRoutes(app);

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
