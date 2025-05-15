import { prisma } from "../db.js";

export const createInvoice = async (userId, data) => {
  const { customerCi, customerFullName, products } = data;

  if (!userId) {
    throw new Error("ID de usuario no proporcionado");
  }

  // Obtener el usuario actual (para acceder a su idAdmin)
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, idAdmin: true },
  });

  return await prisma.$transaction(async (tx) => {
    let customer = await tx.customer.findUnique({
      where: { ci: customerCi },
    });

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          fullName: customerFullName,
          ci: customerCi,
          userId: userId,
        },
      });
    }

    const invoiceDetails = await Promise.all(
      products.map(async (item) => {
        const product = await tx.product.findFirst({
          where: {
            id: Number(item.productId),
            OR: [
              { userId: userId }, // producto creado por el mismo usuario
              { userId: currentUser.idAdmin ?? -1 }, // producto creado por su admin (si tiene)
            ],
          },
        });

        if (!product) {
          throw new Error(
            `No tiene permiso para usar el producto con ID ${item.productId}`
          );
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuficiente para el producto ${product.name}`
          );
        }

        const subtotal = product.price * item.quantity;

        await tx.product.update({
          where: { id: Number(item.productId) },
          data: { stock: { decrement: item.quantity } },
        });

        return {
          productId: Number(item.productId),
          quantity: item.quantity,
          subtotal: subtotal,
        };
      })
    );

    const total = invoiceDetails.reduce(
      (sum, detail) => sum + detail.subtotal,
      0
    );

    const invoice = await tx.invoice.create({
      data: {
        customerId: customer.id,
        total: total,
        details: {
          create: invoiceDetails,
        },
        userId: userId,
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
