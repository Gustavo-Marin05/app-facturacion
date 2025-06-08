import { prisma } from "../db.js";



// Crear cliente
export const createCustomer = async (userId, data) => {
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        fullName: data.fullName,
        ci: data.ci,
        userId: userId,
      },
    });
    return {
      id: newCustomer.id,
      fullName: newCustomer.fullName,
      ci: newCustomer.ci,
      userId: newCustomer.userId,
    };
  } catch (error) {
    console.error("Error al crear cliente:", error);
    return { error: "Error al crear cliente" };
  }
};

//obtener todos los clientes

export const getAllCustomer = async (adminId) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        idAdmin: adminId,
      },
    });
   

    if (users.length === 0) return [];

    const userIds = users.map((user) => user.id);

    const customers = await prisma.customer.findMany({
      where: {
        userId: { in: userIds },
      },
    });

    return customers;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


//obtener solo un cliente
export const getaCustomer = async (idCustomer) => {
  try {
    const findCustomer = await prisma.customer.findFirst({
      where: {
        id: Number(idCustomer),
       
      },
      include:{

        invoices:true
      }
    });

   if (!findCustomer) return null;


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

    if (!findCustomer) return ["customer not found"];

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

export const findCustomerByCiAndUserId = async (ci, userId) => {
  return await prisma.customer.findFirst({
    where: {
      ci,
      userId,
    },
  });
};
