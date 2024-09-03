const express = require('express');
const { getCategories, addCategory, deleteCategory } = require('../controllers/category');

const router = express.Router();

router.get('/all', getCategories); // This should match the route defined in your Express app
router.post('/', addCategory);
router.delete('/:categoryId', deleteCategory);


module.exports = router;
