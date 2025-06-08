import {Router} from 'express';
import { createInvoiceController } from './invoice.Controller.js';
import { authRequired } from "../middleware/validateToken.js";
import {  isAuthenticated } from "../middleware/roleMiddleware.js";
import { getaCustomerController } from '../customer/customer.Controller.js';

const router = Router();

// Ruta para crear una factura
router.post('/invoice',authRequired,isAuthenticated, createInvoiceController);
router.get('/invoice',authRequired,isAuthenticated,getaCustomerController);

export default router;
