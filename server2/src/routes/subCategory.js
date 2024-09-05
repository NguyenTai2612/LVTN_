const express = require('express');
const router = express.Router();
const { getAllSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory } = require('../controllers/subCategory');

// Define routes
router.get('/all', getAllSubCategories);
router.get('/:id', getSubCategoryById);
router.post('/', createSubCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;
