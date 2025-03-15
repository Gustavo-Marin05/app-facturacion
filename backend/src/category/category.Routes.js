import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { getaCategoryController, updateCategoryController } from "./category.Controller.js";


const router = Router();
router.get('/category/:id', authRequired, isAdmin, getaCategoryController);
router.put('/category/:id', authRequired, isAdmin, updateCategoryController); //Nueva ruta



export default router;
