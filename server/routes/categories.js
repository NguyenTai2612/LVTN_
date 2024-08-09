const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");

var imagesArr = [];
var categoryEditId;

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

  if(categoryEditId !== undefined){
    const category = await Category.findById(categoryEditId)

    const images = category.images
    if(images.length !== 0) {
      for(image of images){
        fs.unlinkSync(`uploads/${image}`)
      }
    }
  }

  imagesArr = [];
  const files = req.files;

  for (let i = 0; i < files.length; i++) {
    imagesArr.push(files[i].filename);
  }
  res.send(imagesArr);
});

router.get(`/`, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) { return res.status(404).json({ message: "Page not found" })}


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
      "categoryList":categoryList,     
      "totalPages": totalPages,     
      "page": page    
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);
    const images = category.images;

    if (images.length !== 0) {
      for (image of images) {
        fs.unlinkSync(`uploads/${image}`);
      }
    }


    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }
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

router.get("/:id", async (req, res) => {
  try {
    categoryEditId=req.params.id
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

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        images: imagesArr, // Đảm bảo sử dụng imagesArr hoặc imgFiles nếu bạn cần cập nhật ảnh
        color: req.body.color,
      },
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
