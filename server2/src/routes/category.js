const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getCategories, addCategory, deleteCategory ,updateCategory, getCategoryById, getAllCategories } = require('../controllers/category');

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route with multer middleware
router.post('/', upload.single('image'), addCategory);
router.put('/:categoryId', upload.single('image'), updateCategory);

router.get('/', getAllCategories);
router.get('/all', getCategories); // This should match the route defined in your Express app
router.get('/:categoryId', getCategoryById);

// router.post('/', addCategory);
router.delete('/:categoryId', deleteCategory);


module.exports = router;
