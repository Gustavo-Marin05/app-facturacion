import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./auth/auth.Routes.js";
import userRoutes from "./user/user.Routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api',authRoutes);
app.use('/api',userRoutes);







export default app;