import { prisma } from '../db.js';

export const createInvoice = async (userId, data) => {
  const { customerCi, customerFullName, products } = data;

  if (!userId) {
    throw new Error('ID de usuario no proporcionado');
  }

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
        const product = await tx.product.findUnique({
          where: { id: Number(item.productId), userId: userId },
        });

        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto ${product.name}`);
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

    const total = invoiceDetails.reduce((sum, detail) => sum + detail.subtotal, 0);

    const invoice = await tx.invoice.create({
      data: {
        customerId: customer.id,
        total: total,
        details: {
          create: invoiceDetails,
        },
        userId: userId, // Asegurar que userId se asigna correctamente
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
