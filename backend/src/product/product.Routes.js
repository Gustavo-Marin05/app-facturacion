import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { createProductController, getAllProductController, updateProductController } from "./product.Controller.js";
import { deleteProductController } from "./product.Controller.js";


const router =Router();


router.post('/product',authRequired,isAdmin,createProductController);
router.get('/product',authRequired,isAdmin,getAllProductController);
router.get('/product/:id',authRequired,isAdmin);
router.delete('/product/:id',authRequired,isAdmin);
router.put('/product/:id',authRequired,isAdmin,updateProductController);
router.delete('/product/:id', authRequired, isAdmin, deleteProductController);


export default router;