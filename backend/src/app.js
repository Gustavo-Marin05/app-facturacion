import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./auth/auth.Routes.js";
import userRoutes from "./user/user.Routes.js";
import categoryRoutes from "./category/category.Routes.js";
import customerRoutes from "./customer/customer.Routes.js";
import productRoutes from "./product/product.Routes.js";
import invoiceRoutes from "./invoice/invoice.Routes.js";
import cors from "cors"; // Importa cors

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Asegúrate de que el frontend está en este puerto
  credentials: true,
};

app.use(cors(corsOptions)); // Aplica la configuración de CORS

import swaggerUi from "swagger-ui-express";
import fs from "fs";

const swaggerDocumentation = JSON.parse(
  fs.readFileSync(new URL("../swagger.json", import.meta.url), "utf8")
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", customerRoutes);
app.use("/api", productRoutes);
app.use("/api", invoiceRoutes);

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));
export default app;
