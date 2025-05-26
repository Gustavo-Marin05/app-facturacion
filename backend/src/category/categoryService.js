import { prisma } from "../db.js";

//funcion para obtener una categoria
export const getaCategory = async (user, company, idCategory) => {
  try {
    let filter = { id: Number(idCategory) };

    if (user && user.role === "ADMIN") {
      filter.userId = user.id;
    } else if (company && company.role === "PRODUCER") {
      filter.companyId = company.id;
    } else {
      return { error: "Rol no autorizado para obtener categoría." };
    }

    const categoryFound = await prisma.category.findFirst({
      where: filter,
      include: {
        User: true,      // Relación con User (mayúscula)
        Product: true,   // Relación con Product (mayúscula)
      },
    });

    if (!categoryFound) return { error: "Categoría no encontrada." };

    return categoryFound;
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    return { error: "Error interno del servidor." };
  }
};

//funcion para obtener todas las categorias
export const getAllCategories = async (user, company) => {
  try {
    let filter = {};

    if (user && user.role === "ADMIN") {
      filter = { userId: user.id };
    } else if (company && company.role === "PRODUCER") {
      filter = { companyId: company.id };
    } else {
      return { error: "Rol no autorizado para obtener categorías." };
    }

    const categories = await prisma.category.findMany({
      where: filter,
      include: {
        Product: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return { error: "Error interno del servidor." };
  }
};

//funcion para actualizar una categoria
export const updateCategory = async (user, company, idCategory, newData) => {
  try {
    let filter = { id: Number(idCategory) };

    if (user && user.role === "ADMIN") {
      filter.userId = user.id;  // Solo el admin dueño puede modificar
    } else if (company && company.role === "PRODUCER") {
      filter.companyId = company.id;  // Solo el productor dueño puede modificar
    } else {
      return { error: "Rol no autorizado para actualizar categoría." };
    }

    // Verificar si la categoría existe y pertenece al usuario/empresa
    const categoryFound = await prisma.category.findFirst({
      where: filter,
    });

    if (!categoryFound) {
      return { error: "Categoría no encontrada o sin autorización." };
    }

    // Actualizar la categoría con los nuevos datos
    const updatedCategory = await prisma.category.update({
      where: { id: Number(idCategory) },
      data: newData,
    });

    return updatedCategory;
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return { error: "Error interno al actualizar la categoría." };
  }
};

//funcion para borrar una categoria
export const deleteCategory = async (user, company, idCategory) => {
  try {
    let filter = { id: Number(idCategory) };

    if (user && user.role === "ADMIN") {
      filter.userId = user.id;
    } else if (company && company.role === "PRODUCER") {
      filter.companyId = company.id;
    } else {
      return { error: "Rol no autorizado para eliminar categoría." };
    }

    // Verificar si la categoría existe y pertenece al usuario/empresa
    const categoryFound = await prisma.category.findFirst({
      where: filter,
    });

    if (!categoryFound) {
      return { error: "Categoría no encontrada o sin autorización." };
    }

    const categoryDelete = await prisma.category.delete({
      where: {
        id: Number(idCategory),
      },
    });
    return categoryDelete;
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    return { error: "Error interno del servidor." };
  }
};

// Función para crear una categoría
export const createCategory = async (data, user, company) => {
  try {
    let categoryData = { name: data.name };

    if (user && user.role === "ADMIN") {
      categoryData.userId = user.id;
    } else if (company && company.role === "PRODUCER") {
      categoryData.companyId = company.id;
    } else {
      return { error: "Rol no autorizado para crear categorías." };
    }

    const newCategory = await prisma.category.create({
      data: categoryData,
    });

    return newCategory;
  } catch (error) {
    console.error("Error al crear categoría:", error);
    return { error: "Error interno del servidor." };
  }
};

export const findCategoryById = async (id) => {
  try {
    const findCategory = await prisma.category.findFirst({
      where: {
        id: id,
      },
    });
    return findCategory;
  } catch (error) {
    console.log(error);
  }
};