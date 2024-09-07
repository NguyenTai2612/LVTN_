const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/product");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post('/', upload.array('images', 10), productController.addProduct);

router.post('/', upload.array('images', 5), productController.addProduct);

router.get('/page', productController.getProductPage);

router.get("/all", productController.getProducts);

router.get("/:id/details", productController.getProductDetails);

// router.put("/:id/update", productController.updateProduct);

router.put("/:id/update", upload.array('images'), productController.updateProduct);

router.delete("/:id", productController.deleteProductAndImages);

module.exports = router;
