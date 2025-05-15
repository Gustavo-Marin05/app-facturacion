import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin, isAuthenticated } from "../middleware/roleMiddleware.js";
import {
  createProductController,
  getAllProductController,
  getaProductController,
  updateProductController,
  deleteProductController,
} from "./product.Controller.js";

const router = Router();

router.post("/product", authRequired, isAdmin, createProductController);
router.get("/product", authRequired, isAuthenticated, getAllProductController);
router.get("/product/:id", authRequired, isAuthenticated, getaProductController);
router.put("/product/:id", authRequired, isAdmin, updateProductController);
router.delete("/product/:id", authRequired, isAdmin, deleteProductController);

export default router;
