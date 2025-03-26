import { createProduct, getAllProducts, updateProduct } from "./productService.js";

export const createProductController =async (req,res)=>{

    try {
        const product =await createProduct(req.body,req.user.id);
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json('error en createproduct')
    }
}

export const getAllProductController =async (req,res)=>{
try {

    const product =await getAllProducts(req.user.id);
    res.status(200).json(product)
} catch (error) {
    res.status(400).json('error en getallproduct')
}
}


//tarea de caisa
export const getaProductController =async (req,res)=>{

}


//tarea de monse
export const deleteProductController =async (req,res)=>{

}

export const updateProductController =async (req,res)=>{
    try {
        const product =await updateProduct(req.user.id,req.params.id,req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json('error en updateproduct')
    }
    
}