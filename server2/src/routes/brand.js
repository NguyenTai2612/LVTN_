const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getBrand, addBrand, deleteBrand ,updateBrand, getBrandById, getAllBrand } = require('../controllers/brand');

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the route with multer middleware
router.post('/', upload.single('image'), addBrand);
router.put('/:brandId', upload.single('image'), updateBrand);

router.get('/', getAllBrand);
router.get('/all', getBrand); // This should match the route defined in your Express app
router.get('/:brandId', getBrandById);

// router.post('/', addCategory);
router.delete('/:brandId', deleteBrand);


module.exports = router;
