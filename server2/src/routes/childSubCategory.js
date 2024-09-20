const express = require('express');
const router = express.Router();
const {
  getAllChildSubCategories,
  getChildSubCategoryById,
  createChildSubCategory,
  updateChildSubCategory,
  deleteChildSubCategory,
  getAllChildSubCatBySubCatId
} = require('../controllers/childSubCategory');

// Define routes
router.get('/', getAllChildSubCategories);
router.get('/:id', getChildSubCategoryById);
router.post('/', createChildSubCategory);
router.put('/:id', updateChildSubCategory);
router.delete('/:id', deleteChildSubCategory);
router.get('/subCategory/:subCatId', getAllChildSubCatBySubCatId);

module.exports = router;
