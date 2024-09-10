const subCatService = require('../services/subCategory');

const getSubCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        const response = await subCatService.getSubCategoriesService(page, limit);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ err: 1, msg: error.message });
    }
};

const getAllSubCategories = async (req, res) => {
    try {
        const result = await subCatService.getAllSubCategories();
        if (result.err === 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getAllSubCategories controller:', error);
        res.status(500).json({
            err: -1,
            msg: 'Failed to fetch subcategories'
        });
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

const getCatBySubCatId = async (req, res) => {
    const { subCatId } = req.params;

    try {
        // Gọi service để lấy thông tin category theo subCategoryId
        const category = await subCatService.getCategoryBySubCategoryId(subCatId);

        if (!category) {
            return res.status(404).json({ err: 1, msg: "Category not found" });
        }

        return res.status(200).json({
            err: 0,
            msg: "Success",
            response: category
        });
    } catch (error) {
        console.error("Error in getCatBySubCatId:", error);
        return res.status(500).json({ err: 1, msg: "Internal Server Error" });
    }
};

const getAllSubCatByCatId = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const subCategories = await subCatService.getAllSubCatByCatIdService(categoryId);
      
      if (subCategories) {
        return res.status(200).json({
          err: 0,
          msg: 'Success',
          response: subCategories
        });
      } else {
        return res.status(404).json({
          err: 1,
          msg: 'No subcategories found for this category'
        });
      }
    } catch (error) {
      return res.status(500).json({
        err: 1,
        msg: 'Internal Server Error',
        error: error.message
      });
    }
  };

module.exports = { getSubCategories, getAllSubCatByCatId, getCatBySubCatId, getAllSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory };
