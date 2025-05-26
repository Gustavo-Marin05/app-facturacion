import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import { isAdminOrCompany } from "../middleware/roleMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getaCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "./category.Controller.js";

const router = Router();

router.post('/category', authRequired, isAdminOrCompany, createCategoryController);
router.get('/category/:id', authRequired, isAdminOrCompany, getaCategoryController);
router.get('/category', authRequired, isAdminOrCompany, getAllCategoriesController);
router.put('/category/:id', authRequired, isAdminOrCompany, updateCategoryController);
router.delete('/category/:id', authRequired, isAdminOrCompany, deleteCategoryController);

export default router;
