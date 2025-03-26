import { prisma } from "../db.js";

//funcion para obtener una categoria
export const getaCategory = async (idAdmin, idCategory) => {
  try {
    const categoryFound = await prisma.category.findFirst({
      where: {
        id: Number(idCategory),
        userId: idAdmin,
      },
      include: {
        user: true,
        products: true,
      },
    });

    if (!categoryFound) return ["category not foound"];

    return categoryFound;
  } catch (error) {
    console.log(error);
  }
};

//funcion para obtener toas las categorias
export const getAllCategories = async (idAdmin) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: idAdmin,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            ci: true,
            role: true,
            idAdmin: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        products: true,
      },
    });

    return categories;
  } catch (error) {
    console.log(error);
  }
};

//funcion para actualizar una categoria
export const updateCategory = async (idAdmin, idCategory, newData) => {
  try {
    // Verificar si la categoría existe y pertenece al admin
    const categoryFound = await prisma.category.findFirst({
      where: {
        id: Number(idCategory),
        userId: idAdmin, // Solo el admin dueño puede modificarla
      },
    });

    if (!categoryFound) return ["Category not found or unauthorized"];

    // Actualizar la categoría con los nuevos datos
    const updatedCategory = await prisma.category.update({
      where: { id: Number(idCategory) },
      data: newData,
    });

    return updatedCategory;
  } catch (error) {
    console.log(error);
    return { error: "Error updating category" };
  }
};

//funcion para borrar una categoria

export const deleteCategory = async (idCategory) => {
  try {
    const categoryDelete = await prisma.category.delete({
      where: {
        id: Number(idCategory),
      },
    });
    return categoryDelete;
  } catch (error) {
    console.log(error);
  }
};

// Función para crear una categoría
export const createCategory = async (idAdmin, data) => {
  try {
    const { name } = data;

    // Validar que el campo obligatorio 'name' esté presente
    if (!name) {
      return { error: "El nombre de la categoría es obligatorio." };
    }

    // Verificar si ya existe una categoría con el mismo nombre para el mismo administrador
    const categoryFound = await prisma.category.findFirst({
      where: {
        name: name,
        userId: idAdmin,
      },
    });

    if (categoryFound) {
      return { error: "La categoría ya existe." };
    }

    // Crear la nueva categoría
    const newCategory = await prisma.category.create({
      data: {
        name,
        userId: idAdmin,
      },
    });

    return {
      id: newCategory.id,
      name: newCategory.name,
    };
  } catch (error) {
    console.error("Error al crear la categoría:", error);
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
