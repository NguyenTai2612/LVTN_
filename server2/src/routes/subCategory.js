const express = require('express');
const router = express.Router();
const { getAllSubCategories, getCatBySubCatId,getAllSubCatByCatId,
    getSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory } = require('../controllers/subCategory');

// Define routes
router.get('/', getAllSubCategories);
router.get('/all', getSubCategories);
router.get('/:id', getSubCategoryById);
router.post('/', createSubCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

router.get('/:subCatId/category', getCatBySubCatId);

router.get('/getAllSubCat-by-catId/:categoryId', getAllSubCatByCatId);

module.exports = router;
