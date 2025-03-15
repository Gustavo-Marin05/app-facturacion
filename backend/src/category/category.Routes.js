import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { deleteCategoryController, getaCategoryController, getAllCategoriesController, updateCategoryController } from "./category.Controller.js";


const router = Router();
router.get('/category/:id', authRequired, isAdmin, getaCategoryController);
router.get('/category',authRequired,isAdmin,getAllCategoriesController)
router.put('/category/:id', authRequired, isAdmin, updateCategoryController); //Nueva ruta
router.delete('/category/:id',authRequired,isAdmin,deleteCategoryController)



export default router;
