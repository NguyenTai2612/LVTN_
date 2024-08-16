const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { Category } = require("../models/category");
const { Product } = require("../models/products");
const path = require("path");
const fs = require("fs");
const { ImageUpload } = require("../models/imageUpload");
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

var imagesArr = [];
var productEditId;


// Định nghĩa nơi lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/Tai Nguyen/Desktop/fullstack-ecom/server/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});


// POST 1111 ok 
router.post("/upload", upload.array("images"), async (req, res) => {
  imagesArr = []; // Reset imagesArr here

  try {
    for (const file of req.files) {
      const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      };

      const result = await cloudinary.uploader.upload(file.path, options);
      imagesArr.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    const imagesUploaded = new ImageUpload({ images: imagesArr });
    await imagesUploaded.save();
    return res.status(200).json(imagesArr);
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});
// GET all products with populated category
router.get(`/`, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Default to 10 if perPage is not specified
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found" });
    }

    let productList;

    if (req.query.catName !== undefined) {
      productList = await Product.find({ catName: req.query.catName })
        .populate("category subCat")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    } else {
      productList = await Product.find()
        .populate("category subCat")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (!productList) {
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({
      products: productList,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get(`/featured`, async (req, res) => {
  const productList = await Product.find({ isFeatured: true });

  if (!productList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(productList);
});

// GET id
router.get("/:id", async (req, res) => {
  try {
    productEditId = req.params.id;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "The product with the given ID was not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a new product
router.post(`/create`, async (req, res) => {
  try {
    // Check if the category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).send("Invalid Category!");
    }

    // Convert dateCreated from DD-MM-YYYY to a valid Date object
    if (req.body.dateCreated) {
      const [day, month, year] = req.body.dateCreated.split("-");
      req.body.dateCreated = new Date(year, month - 1, day);
    }
    const specifications = req.body.specifications || {};
    // Create a new product11111
    let product = new Product({
      name: req.body.name,
      subCat: req.body.subCat,
      description: req.body.description,
      images: imagesArr,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      subCat: req.body.subCat,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      specifications: specifications,
    });

    product = await product.save();
    imagesArr = [];
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const images = product.images;

    if (images.length) {
      for (const publicId of images) {
        await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// router.post("/upload-images", upload.array("images"), async (req, res) => {
//   let imagesArr = []; // Reset imagesArr here

//   try {
//     for (const file of req.files) {
//       const options = {
//         use_filename: true,
//         unique_filename: false,
//         overwrite: false,
//       };

//       const result = await cloudinary.uploader.upload(file.path, options);
//       imagesArr.push(result.secure_url);
//       fs.unlinkSync(file.path);
//     }

//     return res.status(200).json({ success: true, images: imagesArr });
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     res.status(500).json({ success: false, error: "Failed to upload images" });
//   }
// });

// PUT update an existing product
router.put("/:id", upload.array('images'), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      subCat: req.body.subCat,
      color: req.body.color,
      price: req.body.price, // assuming 'price' is also part of the product update
      description: req.body.description // add any additional fields for the product
    };

    if (req.files.length > 0) {
      const imagesArr = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        });
        imagesArr.push(result.secure_url); // Store the image URLs
        fs.unlinkSync(file.path); // Delete the file locally after uploading
      }
      updates.images = imagesArr;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
        success: false,
      });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});


module.exports = router;
