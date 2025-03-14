import { getaCategory } from "./categoryService.js";

export const getaCategoryController = async (req, res) => {
    try {
        const category =await getaCategory(idAdmin, idCategory);
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json('error en getacategory');
    }
}