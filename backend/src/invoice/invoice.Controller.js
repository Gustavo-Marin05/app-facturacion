import { invoiceService } from "./invoiceService.js";

export const createInvoice = async (req, res) => {
  try {
    const { userId } = req.user;
    const invoice = await invoiceService.createInvoice(userId, req.body);
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error al crear factura:', error);
    res.status(500).json({ 
      message: 'Error al crear la factura', 
      error: error.message 
    });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const { userId } = req.user;
    const invoices = await invoiceService.getInvoices(userId);
    res.json(invoices);
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({ 
      message: 'Error al obtener facturas', 
      error: error.message 
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const invoice = await invoiceService.getInvoiceById(id, userId);

    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error al obtener factura:', error);
    res.status(500).json({ 
      message: 'Error al obtener factura', 
      error: error.message 
    });
  }
};