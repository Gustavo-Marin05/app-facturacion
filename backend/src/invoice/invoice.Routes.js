import { Router } from 'express';
import { 
  createInvoice, 
  getInvoices, 
  getInvoiceById 
} from './invoice.Controller.js';
import { authRequired } from '../middleware/validateToken.js';
import { isAuthenticated } from '../middleware/roleMiddleware.js';

const router = Router();

// Crear factura (solo usuarios autorizados)
router.post('/invoice', authRequired, isAuthenticated, createInvoice);

// Obtener todas las facturas (solo usuarios autorizados)
router.get('/invoice', authRequired, isAuthenticated, getInvoices);

// Obtener factura por ID (solo usuarios autorizados)
router.get('/invoice/:id', authRequired, isAuthenticated, getInvoiceById);

export default router;