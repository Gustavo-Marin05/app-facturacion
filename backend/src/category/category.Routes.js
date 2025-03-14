import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { getaCategoryController } from "./category.Controller.js";


const router = Router();
router.get('/category/:id', authRequired, isAdmin, getaCategoryController);




export default router;
