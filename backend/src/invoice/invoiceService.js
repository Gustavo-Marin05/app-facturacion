import { prisma } from "../db.js";

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
