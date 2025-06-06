import { findCategoryById } from "../category/categoryService.js";
import { prisma } from "../db.js";

export const createProduct = async (data, user, company) => {
  try {
    const { name, price, stock, categoryId } = data;

    // Verificar autorización
    if (!user && !company) {
      return { error: "Rol no autorizado para crear productos." };
    }

    // Verificar si la categoria existe
    const categoryFound = await findCategoryById(categoryId);
    if (!categoryFound) return { error: "La categoría no existe." };

    // Verificar que la categoría pertenezca al usuario/empresa
    if (user && user.role === "ADMIN") {
      if (categoryFound.userId !== user.id) {
        return { error: "La categoría no pertenece a este administrador." };
      }
    } else if (company && company.role === "PRODUCER") {
      if (categoryFound.companyId !== company.id) {
        return { error: "La categoría no pertenece a esta empresa." };
      }
    }

    // Verificación de que el nombre del producto no existe para este usuario/empresa
    const nameExist = await findProductByName(name, user, company);
    if (nameExist) return { error: "El nombre del producto ya existe." };

    // Preparar datos del producto
    let productData = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: categoryFound.id,
    };

    if (user && user.role === "ADMIN") {
      // Producto pertenece al admin
      productData.userId = user.id;
      // companyId queda undefined (null)
    } else if (company && company.role === "PRODUCER") {
      // Producto pertenece a la empresa
      // userId queda undefined (null)
      productData.companyId = company.id;
    }

    // Creación del producto
    const newProduct = await prisma.product.create({
      data: productData,
      include: {
        category: true,
        company: true,
      },
    });

    return newProduct;
  } catch (error) {
    console.error("Error al crear producto:", error);
    return { error: "Error interno del servidor." };
  }
};

export const getAllProducts = async (user, company) => {
  try {
    let filter = {};

    if (user && user.role === "ADMIN") {
      filter = { userId: user.id, companyId: null };
    } else if (company && company.role === "PRODUCER") {
      filter = { companyId: company.id };
    } else if (user && user.role === "USER") {
      // Verificar si el usuario tiene admin asignado
      if (!user.idAdmin)
        return { error: "El usuario no tiene administrador asignado." };

      // Buscar productos del administrador al que pertenece
      filter = { userId: user.idAdmin, companyId: null };
    } else {
      return { error: "Rol no autorizado para obtener productos." };
    }

    const findProduct = await prisma.product.findMany({
      where: filter,
      include: {
        category: true,
        company: true,
      },
    });

    return findProduct;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return { error: "Error interno del servidor." };
  }
};

export const getaProduct = async (idProduct, user, company) => {
  try {
    let filter = { id: Number(idProduct) };

    if (user && user.role === "ADMIN") {
      filter.userId = user.id;
      filter.companyId = null;
    } else if (company && company.role === "PRODUCER") {
      filter.companyId = company.id;
    } else if (user && user.role === "USER") {
      filter.userId = user.idAdmin;
    } else {
      return { error: "Rol no autorizado para obtener producto." };
    }

    const findProduct = await prisma.product.findFirst({
      where: filter,
      include: {
        category: true,
        company: true,
      },
    });

    if (!findProduct) return { error: "Producto no encontrado." };
    return findProduct;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return { error: "Error interno del servidor." };
  }
};

export const deleteProduct = async (user, company, idProduct) => {
  try {
    const findProduct = await findProductById(idProduct, user, company);
    if (findProduct.error) return findProduct;

    const deleteproduct = await prisma.product.delete({
      where: {
        id: Number(idProduct),
      },
    });

    return deleteproduct;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { error: "Error interno del servidor." };
  }
};

export const updateProduct = async (user, company, idProduct, data) => {
  try {
    // Busqueda del producto
    const findProduct = await findProductById(idProduct, user, company);
    if (findProduct.error) return findProduct;

    // Si se quiere cambiar la categoría, verificar que pertenezca al usuario/empresa
    if (data.categoryId) {
      const categoryFound = await findCategoryById(data.categoryId);
      if (!categoryFound) return { error: "La nueva categoría no existe." };

      if (user && user.role === "ADMIN") {
        if (categoryFound.userId !== user.id) {
          return {
            error: "La nueva categoría no pertenece a este administrador.",
          };
        }
      } else if (company && company.role === "PRODUCER") {
        if (categoryFound.companyId !== company.id) {
          return { error: "La nueva categoría no pertenece a esta empresa." };
        }
      }
    }

    // Si se quiere cambiar el nombre, verificar que no exista
    if (data.name && data.name !== findProduct.name) {
      const nameExist = await findProductByName(data.name, user, company);
      if (nameExist && nameExist.id !== Number(idProduct)) {
        return { error: "El nombre del producto ya existe." };
      }
    }

    // Preparar datos para actualización
    const updateData = { ...data };
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    // Edición del producto
    const productUp = await prisma.product.update({
      where: {
        id: Number(idProduct),
      },
      data: updateData,
      include: {
        category: true,
        company: true,
      },
    });

    return productUp;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return { error: "Error interno del servidor." };
  }
};

// Encontrar un producto por nombre (privada)
const findProductByName = async (name, user, company) => {
  try {
    let filter = { name: name };

    if (user && user.role === "ADMIN") {
      filter.userId = user.id;
      filter.companyId = null;
    } else if (company && company.role === "PRODUCER") {
      filter.companyId = company.id;
    }

    const find = await prisma.product.findFirst({
      where: filter,
    });
    return find;
  } catch (error) {
    console.error("Error al buscar producto por nombre:", error);
    return null;
  }
};

const findProductById = async (id, user, company) => {
  try {
    let filter = { id: Number(id) };

    if (user && user.role === "ADMIN") {
      filter.userId = user.id;
      filter.companyId = null;
    } else if (company && company.role === "PRODUCER") {
      filter.companyId = company.id;
    } else {
      return { error: "Rol no autorizado." };
    }

    const find = await prisma.product.findFirst({
      where: filter,
    });

    if (!find) return { error: "Producto no encontrado." };
    return find;
  } catch (error) {
    console.error("Error al buscar producto por ID:", error);
    return { error: "Error interno del servidor." };
  }
};