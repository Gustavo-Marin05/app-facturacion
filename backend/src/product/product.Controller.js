import { createProduct, deleteProduct, getAllProducts, getaProduct, updateProduct } from "./productService.js";

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
// Implementación de getaProductController
export const getaProductController = async (req, res) => {
    try {
      const product = await getaProduct(req.params.id, req.user.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ message: "Error en getaProduct" });
    }
};


//tarea de monse
export const deleteProductController = async (req, res) => {
    try {
      const result = await deleteProduct(req.user.id, req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json('error en delteproduct');
    }
  };
  

export const updateProductController =async (req,res)=>{
    try {
        const product =await updateProduct(req.user.id,req.params.id,req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json('error en updateproduct')
    }
    
}