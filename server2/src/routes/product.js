const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/product");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.array('images', 5), productController.addProduct);

router.get('/page', productController.getProductPage);

router.get("/all", productController.getProducts);

router.get("/:id/details", productController.getProductDetails);


router.put("/:id/update", upload.array('images'), productController.updateProduct);

router.delete("/:id", productController.deleteProductAndImages);

// Endpoint để lấy sản phẩm theo category
router.get('/:categoryId/by-category', productController.getProductsByCategory);

router.get('/:subCatId/by-subCat', productController.getProductsBySubCat);

router.get('/:categoryId/filter', productController.getProductsByCategoryFilter);

// API để cập nhật số lượt xem sản phẩm
router.put('/:id/views', productController.incrementProductViews);

module.exports = router;
