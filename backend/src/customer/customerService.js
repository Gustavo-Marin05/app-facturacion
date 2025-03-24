import { prisma } from "../db.js";

//funcionalidad tarea de caisa
// Crear cliente
export const createCustomer = async (userId, data) => {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        fullName: data.fullName,
        ci: data.ci,
        userId: userId, // Relaciona al usuario que lo crea
      },
    });
    return {
      id: newCustomer.id,
      fullName: newCustomer.fullName,
      ci: newCustomer.ci,
      userId: newCustomer.userId
    };
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return { error: "Error al crear cliente" };
  }
};

//obtener todos los clientes

export const getAllCustomer = async (userId) => {
  try {
    const customer = await prisma.customer.findMany({
      where: {
        userId: userId,
      },
    });
    if (!customer) return ["no hay clientes"];
    return customer;
  } catch (error) {
    console.log(error);
  }
};

//obtener solo un cliente
export const getaCustomer = async (idCustomer, idUser) => {
  try {
    const findCustomer = await prisma.customer.findUnique({
      where: {
        id: Number(idCustomer),
        userId: Number(idUser),
      },
    });

    if (!findCustomer) return ["no se encontro el cliente"];

    return findCustomer;
  } catch (error) {
    console.log(error);
  }
};


//borrar un cliente
export const deleteCustomer = async (idUser, idCustomer) => {
  try {
    const findCustomer = await prisma.customer.findUnique({
      where: {
        id: idCustomer,
      },
    });

    if (!findCustomer) return ['customer not found'];

    const deleteCustomer = await prisma.customer.delete({
      where: {
        id: Number(idCustomer),
        userId: Number(idUser),
      },
    });

    return deleteCustomer;
  } catch (error) {
    console.log(error);
  }
};

//tarea de monse editar

export const updateCustomerById = async (idAdmin, customerId, data) => {
  try {
    const customerFound = await prisma.customer.findUnique({
      where: { id: Number(customerId) },
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
        ci: data.ci,
      },
    });

    return updatedCustomer;
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    return { error: "Error interno del servidor" };
  }
};
