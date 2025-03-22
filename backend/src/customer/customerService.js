import { prisma } from '../db.js'

export const createCustomer = async () => {
    try {


    } catch (error) {
        console.log(error);
    }
}

export const updateCustomerById = async (idAdmin, customerId, data) => {
    try {
        const customerFound = await prisma.customer.findUnique({
            where: { id: Number(customerId) }
        });

        if (!customerFound) {
            return { error: "Cliente no encontrado" };
        }

        if (customerFound.userId !== idAdmin) {
            return { error: "No autorizado para actualizar este cliente" };
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: Number(customerId) },
            data: {
                fullName: data.fullName,
                ci: data.ci
            }
        });

        return updatedCustomer;
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        return { error: "Error interno del servidor" };
    }
};

