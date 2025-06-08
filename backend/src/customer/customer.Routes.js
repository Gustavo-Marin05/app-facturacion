import { Router } from "express";

import { authRequired } from "../middleware/validateToken.js";
import {  isAuthenticated } from "../middleware/roleMiddleware.js";

import { createCustomerController, deleteCustomerController, getaCustomerController, getAllCustomerController, getCustomerByCi, updateCustomerController } from "./customer.Controller.js";

const router =Router();

router.post('/customer',authRequired,isAuthenticated,createCustomerController);
router.get('/customer',authRequired,isAuthenticated,getAllCustomerController);
router.get('/customer/:id',authRequired,isAuthenticated,getaCustomerController)
router.put("/customer/:id", authRequired, isAuthenticated, updateCustomerController);
router.delete('/customer/:id',authRequired,isAuthenticated,deleteCustomerController);
router.get("/customer/ci/:ci",authRequired,isAuthenticated,getCustomerByCi)


export default router;







