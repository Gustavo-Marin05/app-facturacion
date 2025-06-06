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
        const quantity = parseInt(item.quantity, 10); // 👈 convierte a número

        const product = await tx.product.findFirst({
          where: {
            id: Number(item.productId),
            OR: [{ userId: userId }, { userId: currentUser.idAdmin ?? -1 }],
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
          data: { stock: { decrement: quantity } }, // ✅ ahora es un número
        });

        return {
          productId: Number(item.productId),
          quantity: quantity,
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