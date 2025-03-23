import { Router } from "express";

import { authRequired } from "../middleware/validateToken.js";
import {  isAuthenticated } from "../middleware/roleMiddleware.js";

import { deleteCustomerController, getaCustomerController, getAllCustomerController, updateCustomerController } from "./customer.Controller.js";

const router =Router();


router.get('/customer',authRequired,isAuthenticated,getAllCustomerController);
router.get('/customer/:id',authRequired,isAuthenticated,getaCustomerController)
router.put("/customer/:id", authRequired, isAuthenticated, updateCustomerController);
router.delete('/customer/:id',authRequired,isAuthenticated,deleteCustomerController)


export default router;







