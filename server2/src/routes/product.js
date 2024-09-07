const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/product");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage: storage });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post('/', upload.array('images', 10), productController.addProduct);


router.post('/', upload.array('images', 5), productController.addProduct);

router.get("/all", productController.getProducts);

router.get("/:id/details", productController.getProductDetails);

// router.put("/:id/update", productController.updateProduct);

router.put("/:id/update", upload.array('images'), productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

module.exports = router;
