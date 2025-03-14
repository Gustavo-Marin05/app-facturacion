import {prisma} from '../db.js'

export const getaCategory  =async (idCategory)=>{

    try {
        
        const categoryFound =await prisma.category.findFirst({
            where:{
                id:idCategory,
            }
        })
        if(!categoryFound) return ['category not foound'];
    } catch (error) {
        console.log(error)
    }
}