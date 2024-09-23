const productService = require("../services/product");
const ProductImagesService = require("../services/productImage");
const cloudinary = require("cloudinary").v2;
const { Product, ProductImage, Category, ProductSpecification, SubCategory, ChildSubCategory,Brand } = require("../models");
const { Op } = require("sequelize");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getProducts = async (req, res) => {
  try {
    const response = await productService.getProductsService();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at product controller: " + error.message,
    });
  }
};

// src/controllers/product.js
const getProductPage = async (req, res) => {
  try {
    // Lấy các giá trị từ query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3; // Điều chỉnh limit nếu cần

    const response = await productService.getProductPageService(page, limit);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ err: 1, msg: error.message });
  }
};

const getProductDetails = async (req, res) => {
  const productId = parseInt(req.params.id, 10);

  try {
    const productDetails = await productService.getProductDetailsService(
      productId
    );
    res.json({ err: 0, response: productDetails });
  } catch (error) {
    res.status(404).json({ err: 1, message: error.message });
  }
};

const getProductDetails2 = async (req, res) => {
  try {
    // Lấy tất cả các danh mục
    const categories = await Category.findAll();

    // Kiểm tra xem có danh mục không
    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: "No categories found" });
    }

    // Tạo một danh sách để lưu kết quả
    const allCategoryProducts = [];

    // Lặp qua từng danh mục để lấy 10 sản phẩm
    for (const category of categories) {
      const products = await Product.findAll({
        where: { category_id: category.id },
        limit: 10, // Giới hạn số sản phẩm là 10
        include: [
          { model: ProductImage, attributes: ["id", "imageUrl"] },
          { model: Brand, attributes: ["id", "name"] },
          { model: SubCategory, attributes: ["id", "subCat"] },
          { model: ChildSubCategory, attributes: ["id", "name"] },
        ],
      });

      // Nếu có sản phẩm, thêm vào kết quả
      if (products.length > 0) {
        allCategoryProducts.push({
          categoryId: category.id,
          products: products,
        });
      }
    }

    // Trả về kết quả
    res.status(200).json({ err: 0, response: allCategoryProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const addProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log form fields
    console.log("Files:", req.files); // Log file details

    const {
      name,
      description,
      price,
      oldPrice,
      brand_id,
      category_id,
      sub_category_id,
      child_sub_category_id,
      countInStock,
      rating,
      isFeatured,
      discount,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !oldPrice ||
      !brand_id ||
      !category_id ||
      !sub_category_id ||
      !child_sub_category_id ||
      !countInStock
    ) {
      throw new Error("Missing required fields");
    }

    // Xử lý upload hình ảnh
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadedImage = await cloudinary.uploader.upload(file.path);
        imageUrls.push(uploadedImage.secure_url);
      }
    }

    const productData = {
      name,
      description,
      price,
      oldPrice,
      brand_id,
      category_id,
      sub_category_id,
      child_sub_category_id,
      countInStock,
      rating,
      isFeatured,
      discount,
    };

    // Tạo sản phẩm mới và lưu hình ảnh vào bảng ProductImage
    const response = await productService.addProductService(
      productData,
      imageUrls
    );
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: "Fail at product controller: " + error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Đảm bảo biến productId được lấy từ URL params
    const {
      name,
      description,
      price,
      oldPrice,
      countInStock,
      rating,
      isFeatured,
      discount,
      brand_id,
      category_id,
      sub_category_id,
      child_sub_category_id,
    } = req.body;
    const images = req.files;

    if (!productId) {
      return res.status(400).json({ err: -1, msg: "Product ID is required" });
    }

    if (!name || !description || !price || !countInStock) {
      return res
        .status(400)
        .json({ err: -1, msg: "No valid data provided for update" });
    }

    // Cập nhật thông tin sản phẩm qua service
    const updatedProduct = await productService.updateProductService(
      productId,
      {
        name,
        description,
        price,
        oldPrice,
        countInStock,
        rating,
        isFeatured,
        discount,
        brand_id,
        category_id,
        sub_category_id,
        child_sub_category_id,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ err: -1, msg: "Product not found" });
    }

    res.status(200).json({ err: 0, msg: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ err: -1, msg: error.message });
  }
};

const deleteProductAndImages = async (req, res) => {
  const productId = req.params.id;

  try {
    // Xóa tất cả các hình ảnh liên quan đến sản phẩm
    await ProductImage.destroy({
      where: { product_id: productId },
    });

    // Xóa sản phẩm
    const deletedProduct = await Product.destroy({
      where: { id: productId },
    });

    if (deletedProduct) {
      return res.status(200).json({
        err: 0,
        msg: "Product and its images deleted successfully",
      });
    } else {
      return res.status(404).json({
        err: 1,
        msg: "Product not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      err: 1,
      msg: "Error deleting product and images",
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Gọi service để lấy sản phẩm theo categoryId
    const products = await productService.getProductsByCategory(categoryId);

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category." });
    }

    res.json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductsByCategoryFilter = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { priceRange = [], brands = [], rating } = req.query;

    const minPrice = parseFloat(priceRange[0]) || null;
    const maxPrice = parseFloat(priceRange[1]) || null;

    const whereClause = {
      category_id: categoryId,
      ...(minPrice && maxPrice
        ? { price: { [Op.between]: [minPrice, maxPrice] } }
        : {}),
      ...(brands.length ? { brand_id: brands } : {}),
      ...(rating ? { rating } : {}),
    };

    const products = await Product.findAll({
      where: whereClause,
      include: [
        { model: ProductImage, attributes: ["imageUrl"] },
        { model: Category, attributes: ["name"] },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductsBySubCat = async (req, res) => {
  try {
    const { subCatId } = req.params;
    const products = await productService.getProductsBySubCat(subCatId);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const incrementProductViews = async (req, res) => {
  const productId = req.params.id;

  try {
    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Cập nhật số lượt xem
    product.views = (product.views || 0) + 1;
    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hàm controller để lấy sản phẩm theo childSubCategoryId
const getProductsByChildSubCategory = async (req, res) => {
  try {
    const { childSubCategoryId } = req.params;

    // Gọi service để lấy sản phẩm theo childSubCategoryId
    const products = await productService.getProductsByChildSubCategory(childSubCategoryId);

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this child subcategory." });
    }

    // Trả về kết quả nếu tìm thấy sản phẩm
    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Exporting the function
module.exports = {
  getProducts,
  getProductDetails,
  addProduct,
  updateProduct,
  deleteProductAndImages,
  getProductPage,
  getProductsByCategory,
  getProductsBySubCat,
  getProductsByCategoryFilter,
  incrementProductViews,
  getProductDetails2,
  getProductsByChildSubCategory
};
