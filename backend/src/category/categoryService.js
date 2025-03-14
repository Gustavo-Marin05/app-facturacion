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