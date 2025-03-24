import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./auth/auth.Routes.js";
import userRoutes from "./user/user.Routes.js";
import categoryRoutes from "./category/category.Routes.js";
import customerRoutes from "./customer/customer.Routes.js"
import invoiceRoutes from './invoice/invoice.Routes.js'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',customerRoutes)
app.use('/api',invoiceRoutes)


export default app;