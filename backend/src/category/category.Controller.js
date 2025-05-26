import { deleteCategory, getaCategory, getAllCategories, updateCategory } from "./categoryService.js";
import { createCategory } from "./categoryService.js";

export const getaCategoryController = async (req, res) => {
    try {
        const category = await getaCategory(req.user, req.company, req.params.id);
        
        if (category.error) {
            return res.status(403).json({ message: category.error });
        }
        
        res.status(200).json(category);
    } catch (error) {
        console.error("Error en getaCategoryController:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

//Nuevo controlador para actualizar categoria
export const updateCategoryController = async (req, res) => {
    try{
        const { id } = req.params; //ID de la categoria a modificar
        const user = req.user; // Usuario autenticado (si es admin)
        const company = req.company; // Empresa autenticada (si es producer)
        const newData = req.body; // Datos de la categoria a actualizar 

        const updatedCategory = await updateCategory(user, company, id, newData);
        
        if(updatedCategory.error){
            return res.status(400).json({ error: updatedCategory.error });
        }

        res.status(200).json(updatedCategory);
    } catch (error){
        console.error("Error en updateCategoryController:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//controlador para obtener todas las categorias
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories(req.user, req.company);

    if (categories.error) {
      return res.status(403).json({ message: categories.error });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en getAllCategoriesController:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

//controlador para borrar categoria
export const deleteCategoryController = async (req, res) => {
    try {
        const category = await deleteCategory(req.user, req.company, req.params.id);
        
        if (category.error) {
            return res.status(403).json({ message: category.error });
        }
        
        res.status(200).json(category);
    } catch (error) {
        console.error("Error en deleteCategoryController:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

// Controlador para crear una categoría
export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body, req.user, req.company);

    if (category.error) {
      return res.status(403).json({ message: category.error });
    }

    res.status(201).json(category);
  } catch (error) {
    console.error("Error en createCategoryController:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};