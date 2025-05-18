import { deleteCategory, getaCategory, getAllCategories, updateCategory } from "./categoryService.js";
import { createCategory } from "./categoryService.js";

export const getaCategoryController = async (req, res) => {
    try {
        const category =await getaCategory(req.user.id, req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json('error en getacategory');
    }
}
//Nuevo controlador para actualizar categoria
export const updateCategoryController = async (req, res) => {
    try{
        const { id } = req.params; //ID de la categoria a modificar
        const idAdmin = req.user.id; // ID del admin autenticado (desde el middleware de autenticacion)
        const newData = req.body; // Datos de la categoria a actualizar 

        const updatedCategory = await updateCategory(idAdmin, id, newData);
        
        if(updatedCategory.error){
            return res.status(400).json({ error: updatedCategory.error });
        }

        res.status(200).json(updatedCategory);
    } catch (error){
        res.status(500).json({ error: 'Error al actualizar la categoria' });
    }
};

//controlador para obtener todas las categorias
export const getAllCategoriesController = async (req, res) => {
    try {
        
        const category=await getAllCategories(req.user.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json('error en getallcategories')
        
    }
}

//controlador para borrar todas las categorias
export const deleteCategoryController =async (req,res)=>{
    try {
        const category =await deleteCategory(req.params.id);
        res.status(200).json(category)
    } catch (error) {
        res.status(400).json('error en deletecategory')
    }
}

// Controlador para crear una categoría
export const createCategoryController = async (req, res) => {
    try {
        const idAdmin = req.user.id; // ID del administrador autenticado
        const data = req.body; // Datos de la categoría a crear

        const newCategory = await createCategory(idAdmin, data);

        if (newCategory.error) {
            return res.status(400).json({ error: newCategory.error });
        }

        res.status(200).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la categoría.' });
    }
};

