const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { ImageUpload } = require("../models/imageUpload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

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

// Reset imagesArr to avoid residual data affecting subsequent requests
let imagesArr = [];

// POST
router.post('/upload', upload.array("images"), async (req, res) => {
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
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

router.get(`/`, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10; // Allow perPage to be set via query
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: "No data found" });
    }

    const categoryList = await Category.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!categoryList.length) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found." });
    }
    return res.status(200).json({
      categoryList,
      totalPages,
      page,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "The category with the given ID was not found." });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      images: imagesArr,
      color: req.body.color,
    });

    const savedCategory = await category.save();
    imagesArr = []; // Reset the array after saving

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    const images = category.images;

    if (images.length) {
      for (const publicId of images) {
        await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT 
router.put("/:id", upload.array('images'), async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      subCat: req.body.subCat,
      color: req.body.color,
    };

    if (req.files.length > 0) {
      const imagesArr = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
        });
        imagesArr.push(result.secure_url); // Lưu URL để hiển thị ảnh
        fs.unlinkSync(file.path); // Xóa file local sau khi upload
      }
      updates.images = imagesArr;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found!",
        success: false,
      });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});


module.exports = router;
