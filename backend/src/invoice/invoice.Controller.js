import { createInvoice, generateInvoicePdf, getAllinvoice } from './invoiceService.js';

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


export const getAllInvoiceController =async (req,res)=>{
  try {
    const invoice = await getAllinvoice(req.user.id);
    res.status(200).json(invoice);
    
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


//controlador de como 

export const downloadInvoicePdfController = async (req, res) => {
  const invoiceId = Number(req.params.id);

  if (isNaN(invoiceId)) {
    return res.status(400).json({ error: "ID de factura inválido" });
  }

  try {
    await generateInvoicePdf(invoiceId, res);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({ error: error.message });
  }
};
