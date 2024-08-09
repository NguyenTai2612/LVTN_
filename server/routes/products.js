const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const pLimit = require("p-limit");
const { Category } = require("../models/category");
const { Product } = require("../models/products");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

var imagesArr = [];
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

router.post(`/upload`, upload.array("images"), async (req, res) => {
  imagesArr = [];
  const files = req.files;
  for (let i = 0; i < files.length; i++) {
    imagesArr.push(files[i].filename);
  }
  console.log(imagesArr);
  res.json(imagesArr);
});

// GET all products with populated category
router.get(`/`, async (req, res) => {

  const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) { return res.status(404).json({ message: "Page not found" })}

    const productList = await Product.find().populate("category")
    .skip((page - 1) * perPage)     
    .limit(perPage)
    .exec();

    if(!productList){
      res.status(500).json({ success: false })
    }

 
    return res.status(200).json({
      "products":productList,     
      "totalPages": totalPages,     
      "page": page    
    });

    res.send(productList)
});

// GET id
router.get("/:id", async (req, res) => {
  try {
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

    // Create a new product
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      images: imagesArr, // Use the uploaded image URLs from the request
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

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
    const images = product.images;

    if (images.length !== 0) {
      for (image of images) {
        fs.unlinkSync(`uploads/${image}`);
      }
    }

    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }
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

// PUT update an existing product
router.put("/:id", async (req, res) => {
  try {
    // Check if the category exists
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).send("Invalid Category!");
      }
    }

    // Convert dateCreated from DD-MM-YYYY to a valid Date object
    if (req.body.dateCreated) {
      const [day, month, year] = req.body.dateCreated.split("-");
      req.body.dateCreated = new Date(year, month - 1, day);
    }

    // Upload images to Cloudinary
    const imagesToUpload = req.body.images.map((image) => {
      return limit(async () => {
        try {
          const result = await cloudinary.uploader.upload(image);
          return result.secure_url;
        } catch (error) {
          console.error(`Error uploading ${image} - ${error.message}`);
          throw new Error(`Error uploading ${image} - ${error.message}`);
        }
      });
    });

    const imgurl = await Promise.all(imagesToUpload);

    if (!imgurl || imgurl.length === 0) {
      return res.status(400).json({
        error: "No images uploaded!",
        status: false,
      });
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        images: images, // Use the uploaded image URLs
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
