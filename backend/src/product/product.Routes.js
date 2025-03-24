import { Router } from "express";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router =Router();


router.post('/product',authRequired,isAdmin);
router.get('/product',authRequired,isAdmin);
router.get('/product/:id',authRequired,isAdmin);
router.delete('/product/:id',authRequired,isAdmin);
router.put('/product/:id',authRequired,isAdmin);


export default router;