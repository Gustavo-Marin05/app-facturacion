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
    throw new Error("Factura no encontrada");
  }

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=factura-${invoice.number}.pdf`
  );
  doc.pipe(res);

  // Encabezado
  doc.fontSize(22).fillColor("#333").text("factura", { align: "center" }).moveDown(0.5);
  doc.moveTo(50, 100).lineTo(545, 100).stroke();

  // Datos del cliente
  doc.fontSize(16).fillColor("#000").text(`Nro:${invoice.number}`, 400, 110);
  doc.fontSize(12).fillColor("#555")
    .text(`Fecha: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 120)
    .text(`Cliente: ${invoice.customer.fullName}`, 50, 140)
    .text(`CI/NIT: ${invoice.customer.ci}`, 50, 160);

  // Tabla
  let y = 190;
  doc.fontSize(12).font("Helvetica-Bold");
  doc.text("Cantidad", 50, y);
  doc.text("Descripción", 120, y);
  doc.text("Precio Unitario", 350, y, { width: 90, align: "right" });
  doc.text("Subtotal", 450, y, { width: 90, align: "right" });

  y += 20;
  doc.moveTo(50, y - 5).lineTo(545, y - 5).stroke();
  doc.font("Helvetica");

  // CORRECTO: recorrer `details`, no `items`
  invoice.details.forEach((item) => {
    const description = item.product?.name || item.description || "Sin descripción";
    const qty = item.quantity || 1;
    const price = item.subtotal ;
    const subtotal = qty * price;

    doc.text(qty.toString(), 50, y);
    doc.text(description, 120, y);
    doc.text(`Bs ${price.toFixed(2)}`, 350, y, { width: 90, align: "right" });
    doc.text(`Bs ${subtotal.toFixed(2)}`, 450, y, { width: 90, align: "right" });
    y += 20;
  });

  // Totales
  doc.moveTo(50, y).lineTo(545, y).stroke();
  y += 10;
  doc.font("Helvetica-Bold");
  doc.text("Subtotal:", 350, y, { width: 90, align: "right" });
  doc.text(`Bs ${(invoice.total - invoice.tax).toFixed(2)}`, 450, y, { width: 90, align: "right" });
  y += 20;
  doc.text("IVA (13%):", 350, y, { width: 90, align: "right" });
  doc.text(`Bs ${invoice.tax.toFixed(2)}`, 450, y, { width: 90, align: "right" });
  y += 20;
  doc.text("Total:", 350, y, { width: 90, align: "right" });
  doc.text(`Bs ${invoice.total.toFixed(2)}`, 450, y, { width: 90, align: "right" });

  // Pie
  doc.fontSize(10).fillColor("#999").text("Gracias por su compra. ¡Vuelva pronto!", 50, 700, {
    align: "center",
    width: 495,
  });

  doc.end();
};
