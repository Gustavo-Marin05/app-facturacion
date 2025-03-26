import {Router} from 'express';
import { createInvoiceController } from './invoice.Controller.js';
import { authRequired } from "../middleware/validateToken.js";
import {  isAuthenticated } from "../middleware/roleMiddleware.js";

const router = Router();

// Ruta para crear una factura
router.post('/invoice',authRequired,isAuthenticated, createInvoiceController);

export default router;
