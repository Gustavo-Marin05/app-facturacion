import { prisma } from '../db.js'

export const getaCategory = async (idAdmin, idCategory) => {

    try {

        const categoryFound = await prisma.category.findFirst({
            where: {
                id: Number(idCategory),
                userId: idAdmin
            },
            include:{
                user: true,
                products: true
            }
        });

        if (!categoryFound) return ['category not foound'];

        return categoryFound;


    } catch (error) {
        console.log(error)
    }
}


export const getAllCategories =async ()=>{
   
    
}


export const updateCategory = async (idAdmin, idCategory, newData) => {
    
    try {
        // Verificar si la categoría existe y pertenece al admin
        const categoryFound = await prisma.category.findFirst({
            where: {
                id: Number(idCategory),
                userId: idAdmin // Solo el admin dueño puede modificarla
            }
        });

        if (!categoryFound) return { error: 'Category not found or unauthorized' };

        // Actualizar la categoría con los nuevos datos
        const updatedCategory = await prisma.category.update({
            where: { id: Number(idCategory) },
            data: newData
        });

        return updatedCategory;
    } catch (error) {
        console.log(error);
        return { error: 'Error updating category' };
    }
};
