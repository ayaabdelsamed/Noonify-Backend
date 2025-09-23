import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import dbConnection from "./config/database.js";
import categoryRouter from "./routes/categoryRoute.js";
dotenv.config({ path: 'config.env'})

// Connect with db
dbConnection()

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}
// mount Routes
app.use("/api/v1/categories", categoryRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
