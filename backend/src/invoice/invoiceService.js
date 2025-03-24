import { prisma } from "../db.js";
import { createCustomerController }  from '../customer/customer.Controller.js'

export const invoiceService = {
  // Crear factura con múltiples detalles
  createInvoice: async (userId, data) => {
    const { 
      customerCi, 
      customerFullName, 
      products 
    } = data;

    // Iniciar transacción para asegurar consistencia
    return await prisma.$transaction(async (tx) => {
      // Buscar cliente por CI
      let customer = await tx.customer.findUnique({
        where: { ci: customerCi }
      });

      // Si no existe, crear nuevo cliente
      if (!customer) {
        const newCustomerData = await createCustomerController(userId, {
          fullName: customerFullName,
          ci: customerCi
        });

        // Verificar si hubo error al crear cliente
        if (newCustomerData.error) {
          throw new Error(newCustomerData.error);
        }

        customer = newCustomerData;
      }

      // Verificar y procesar productos
      const invoiceDetails = await Promise.all(products.map(async (item) => {
        // Verificar producto
        const product = await tx.product.findUnique({
          where: { 
            id: Number(item.productId),
            userId: userId // Asegurar que el producto pertenece al usuario
          }
        });

        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        // Verificar stock
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto ${product.name}`);
        }

        // Calcular subtotal
        const subtotal = product.price * item.quantity;

        // Actualizar stock
        await tx.product.update({
          where: { id: item.productId },
          data: { 
            stock: { decrement: item.quantity } 
          }
        });

        return {
          productId: item.productId,
          quantity: item.quantity,
          subtotal: subtotal
        };
      }));

      // Calcular total de la factura
      const total = invoiceDetails.reduce((sum, detail) => sum + detail.subtotal, 0);

      // Crear factura
      const invoice = await tx.invoice.create({
        data: {
          userId: userId,
          customerId: customer.id,
          total: total,
          details: {
            create: invoiceDetails
          }
        },
        include: {
          details: {
            include: {
              product: true
            }
          },
          customer: true
        }
      });

      return invoice;
    });
  },

  // Obtener todas las facturas del usuario
  getInvoices: async (userId) => {
    return await prisma.invoice.findMany({
      where: { userId: userId },
      include: {
        customer: true,
        details: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  },

  // Obtener factura por ID
  getInvoiceById: async (id, userId) => {
    return await prisma.invoice.findUnique({
      where: { 
        id: parseInt(id),
        userId: userId // Asegurar que la factura pertenece al usuario
      },
      include: {
        customer: true,
        details: {
          include: {
            product: true
          }
        }
      }
    });
  }
};