import { createInvoice } from './invoiceService.js';

export const createInvoiceController = async (req, res) => {
  try {
    const invoice = await createInvoice(req.user.id, req.body);
    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error al crear la factura:", error);
    
    // Si el error es de validación, devolver 400
    if (error.message.includes("Producto") || error.message.includes("Debe agregar")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Error interno del servidor" });
  }
};
