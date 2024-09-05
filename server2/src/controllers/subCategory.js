const subCatService = require('../services/subCategory');

const getAllSubCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        const response = await subCatService.getSubCategoriesService(page, limit);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ err: 1, msg: error.message });
    }
};


const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await subCatService.getSubCategoryById(id);
        if (!subCategory) {
            return res.status(404).json({ err: -1, msg: 'Subcategory not found' });
        }
        res.status(200).json({ err: 0, response: subCategory });
    } catch (error) {
        res.status(500).json({ err: -1, msg: 'Failed to fetch subcategory: ' + error.message });
    }
};

const createSubCategory = async (req, res) => {
    try {
        const { category_id, subCat } = req.body;
        const newSubCategory = await subCatService.createSubCategory({ category_id, subCat });
        res.status(201).json({ err: 0, response: newSubCategory });
    } catch (error) {
        res.status(500).json({ err: -1, msg: 'Failed to create subcategory: ' + error.message });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, subCat } = req.body;
        const updatedSubCategory = await subCatService.updateSubCategory(id, { category_id, subCat });
        if (updatedSubCategory) {
            res.status(200).json({ err: 0, response: updatedSubCategory });
        } else {
            res.status(404).json({ err: -1, msg: 'Subcategory not found' });
        }
    } catch (error) {
        res.status(500).json({ err: -1, msg: 'Failed to update subcategory: ' + error.message });
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await subCatService.deleteSubCategory(id);
        if (deleted) {
            res.status(200).json({ err: 0, msg: 'Subcategory successfully deleted' });
        } else {
            res.status(404).json({ err: -1, msg: 'Subcategory not found' });
        }
    } catch (error) {
        res.status(500).json({ err: -1, msg: 'Failed to delete subcategory: ' + error.message });
    }
};

module.exports = { getAllSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory };
