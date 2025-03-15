import { getaCategory, updateCategory } from "./categoryService.js";

export const getaCategoryController = async (req, res) => {
    try {
        const category =await getaCategory(idAdmin, idCategory);
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