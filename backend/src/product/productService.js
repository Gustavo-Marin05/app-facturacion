import { findCategoryById } from "../category/categoryService.js";
import { prisma } from "../db.js";

export const createProduct = async (data, idAdmin) => {
  try {
    const { name, price, stock, categoryId } = data;

    //verificar si la categoria existe
    const categoryFound =await findCategoryById(categoryId);
    if (!categoryFound) return ["la categoria no existe"];

    //verificacion de que si el nombre del producto existe

    const nameExist =await findProductByName(name);
    if(nameExist) return ['el nombre del producto ya existe'];

    //creacion del producto

    const newProduct=await prisma.product.create({
        data:{
            name,
            price,
            stock,
            categoryId:categoryFound.id,
            userId:idAdmin
        },
        include:{
            category:true
        }
    })

    return newProduct;


  } catch (error) {
    console.log(error);
  }
};

export const getAllProducts = async (idAdmin) => {
try {
  const findProduct =await prisma.product.findMany({
    where:{
      userId:idAdmin
    }
    ,include:{
      category:true
    }
  })

  return findProduct;
} catch (error) {
  console.log(error);
}


};

//tarea de caisa 
export const getaProduct = async () => {};

//tarea de monse
export const deleteProduct = async () => {};



export const updateProduct = async (idAdmin,idProduct,data) => {
  try {
    
    //busqueda del producto
    const findProduct =await findProductById(idProduct, idAdmin);
    if(!findProduct) return ['producto no encontrado'];

    //edicion del producto
    const productUp =await prisma.product.update({
      where:{
        id:Number(idProduct)
      },
      data:data
    })

    return productUp;
    
  } catch (error) {
    console.log(error)
  }
};


//encontrar un producto por el
const findProductByName = async (name) => {
  try {
    const find = await prisma.product.findFirst({
      where: {
        name: name,
      },
    });
    return find;
  } catch (error) {
    console.log(error);
  }
};


const findProductById = async (id,idAdmin)=>{
  try {
    const find =await prisma.product.findUnique({
      where:{
        id:Number(id),
        userId:idAdmin
      }
    })
    return find;
  } catch (error) {
    console.log(error
    )
  }
}