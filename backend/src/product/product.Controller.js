import { createProduct, deleteProduct, getAllProducts, getaProduct, updateProduct } from "./productService.js";

export const createProductController = async (req, res) => {
    try {
        const product = await createProduct(req.body, req.user, req.company);
        
        if (product.error) {
            return res.status(400).json({ message: product.error });
        }
        
        res.status(201).json(product);
    } catch (error) {
        console.error("Error en createProductController:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

export const getAllProductController = async (req, res) => {
    try {
        const products = await getAllProducts(req.user, req.company);
        
        if (products.error) {
            return res.status(403).json({ message: products.error });
        }
        
        res.status(200).json(products);
    } catch (error) {
        console.error("Error en getAllProductController:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}

// Implementación de getaProductController
export const getaProductController = async (req, res) => {
    try {
        const product = await getaProduct(req.params.id, req.user, req.company);
        
        if (product.error) {
            return res.status(404).json({ message: product.error });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error("Error en getaProductController:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        const result = await deleteProduct(req.user, req.company, req.params.id);
        
        if (result.error) {
            return res.status(404).json({ message: result.error });
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error("Error en deleteProductController:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const product = await updateProduct(req.user, req.company, req.params.id, req.body);
        
        if (product.error) {
            return res.status(400).json({ message: product.error });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error("Error en updateProductController:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
}