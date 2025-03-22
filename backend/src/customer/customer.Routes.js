import { Router } from "express";
import { updateCustomer } from "./customerController.js";
import { authRequired } from "../middleware/validateToken.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

router.put("/customer/:id", authRequired, isAdmin, updateCustomer);
router.put('/customer', authRequired, isAdmin, updateCustomer);

export default router;
