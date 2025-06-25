import { prisma } from "../db.js";

import PDFDocument from "pdfkit";

export const createInvoice = async (userId, data) => {
  const { customerCi, customerFullName, products } = data;

  if (!userId) {
    throw new Error("ID de usuario no proporcionado");
  }

  // Obtener usuario para el NIT (aquí ci es tu NIT)
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, idAdmin: true, ci: true },
  });

  if (!currentUser) {
    throw new Error("Usuario no encontrado");
  }

  return await prisma.$transaction(async (tx) => {
    // Buscar o crear cliente
    let customer = await tx.customer.findUnique({
      where: { ci: customerCi },
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          fullName: customerFullName,
          ci: customerCi,
          userId,
        },
      });
    }

    // Crear detalles con validación stock y permisos
    const invoiceDetails = await Promise.all(
      products.map(async (item) => {
        const quantity = parseInt(item.quantity, 10);

        const product = await tx.product.findFirst({
          where: {
            id: Number(item.productId),
            OR: [{ userId }, { userId: currentUser.idAdmin ?? -1 }],
          },
        });

        if (!product) {
          throw new Error(
            `No tiene permiso para usar el producto con ID ${item.productId}`
          );
        }

        if (product.stock < quantity) {
          throw new Error(
            `Stock insuficiente para el producto ${product.name}`
          );
        }

        const subtotal = product.price * quantity;

        await tx.product.update({
          where: { id: Number(item.productId) },
          data: { stock: { decrement: quantity } },
        });

        return {
          productId: Number(item.productId),
          quantity,
          subtotal,
        };
      })
    );

    // Calcular subtotal, impuesto y total
    const subtotalTotal = invoiceDetails.reduce(
      (sum, d) => sum + d.subtotal,
      0
    );
    const tax = parseFloat((subtotalTotal * 0.13).toFixed(2)); // 13% IVA
    const total = parseFloat((subtotalTotal + tax).toFixed(2));

    // Obtener último número de factura para usuario y asignar siguiente
    const lastInvoice = await tx.invoice.findFirst({
      where: { userId },
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const nextInvoiceNumber = lastInvoice ? lastInvoice.number + 1 : 1;

    // Crear factura con los nuevos campos
    const invoice = await tx.invoice.create({
      data: {
        customerId: customer.id,
        total,
        tax,
        number: nextInvoiceNumber,
        nit: customerCi,
        details: {
          create: invoiceDetails,
        },
        userId,
      },
      include: {
        details: {
          include: {
            product: true,
          },
        },
      },
    });

    return invoice;
  });
};

export const getAllinvoice = async (adminId) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        idAdmin: adminId,
      },
    });
    if (users.length === 0) return [];

    const userIds = users.map((user) => user.id);
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: { in: userIds },
      },
      select: {
        id: true,
        userId: true,
        total: true,
        createdAt: true, // ✅ asegúrate de incluir esto
      },
    });

    return invoices;
  } catch (error) {
    console.log(error);
    return { error: "Error updating category" };
  }
};

//esto tendria que devolverme todas las invoices de un solo customer

//funcion para poder generar el invoice en un pdf
export const generateInvoicePdf = async (invoiceId, res) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId },
    include: {
      customer: true,
      details: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!invoice) {
    res.status(404).send("Factura no encontrada");
    return;
  }

  const doc = new PDFDocument({
    size: [226.77, 700], // 80mm x alto
    margin: 10,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=factura-${invoice.number}.pdf`
  );
  doc.pipe(res);

  // Encabezado
  doc
    .fontSize(16)
    .fillColor("#000")
    .text("FACTURA", { align: "center" })
    .moveDown(0.5);

  // Cliente
  doc
    .fontSize(10)
    .fillColor("#000")
    .text(`Nro: ${invoice.number}`)
    .text(`Fecha: ${new Date(invoice.createdAt).toLocaleDateString()}`)
    .text(`Cliente: ${invoice.customer.fullName}`)
    .text(`CI/NIT: ${invoice.customer.ci}`)
    .moveDown(0.5);

  // Tabla encabezado
  let y = doc.y + 5;
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Cant.", 10, y);
  doc.text("Descripción", 45, y);
  doc.text("P.Unit", 130, y, { width: 40, align: "right" });
  doc.text("Subt.", 175, y, { width: 40, align: "right" });

  y += 12;
  doc.moveTo(10, y).lineTo(216, y).stroke();
  y += 3;

  doc.font("Helvetica").fontSize(9);

  // Detalles
  invoice.details.forEach((item) => {
    const description = item.product?.name || item.description || "Sin descripción";
    const qty = item.quantity || 1;
    const price = item.subtotal / qty;
    const subtotal = qty * price;

    doc.text(qty.toString(), 10, y);
    doc.text(description.substring(0, 20), 45, y);
    doc.text(`Bs ${price.toFixed(2)}`, 130, y, { width: 40, align: "right" });
    doc.text(`Bs ${subtotal.toFixed(2)}`, 175, y, { width: 40, align: "right" });

    y += 12;
  });

  // Línea
  doc.moveTo(10, y).lineTo(216, y).stroke();
  y += 6;

  // Totales (alineados)
  doc.font("Helvetica-Bold");

  const totalLine = (label, amount) => {
    doc
      .text(label, 90, y, { width: 80, align: "right" })
      .text(`Bs ${amount.toFixed(2)}`, 175, y, { width: 40, align: "right" });
    y += 12;
  };

  totalLine("Subtotal:", invoice.total - invoice.tax);
  totalLine("IVA (13%):", invoice.tax);
  totalLine("Total:", invoice.total);

  // Pie de página
  y += 15;
  doc
    .fontSize(8)
    .fillColor("#555")
    .text("Gracias por su compra. ¡Vuelva pronto!", 10, y, {
      align: "center",
      width: 206.77,
    });

  doc.end();
};

