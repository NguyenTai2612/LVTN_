const db = require("../models");
const { Product, ProductImage, Brand, Category, SubCategory, ChildSubCategory } = db;
const cloudinary = require("cloudinary").v2;
const { Op } = require('sequelize');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL PRODUCTS
const getProductsService = async () => {
  try {
    const response = await Product.findAll({
      raw: true,
      attributes: {
        exclude: ["createdAt", "updatedAt", "description"],
      },
    });
    return {
      err: response.length > 0 ? 0 : 1,
      msg: response.length > 0 ? "OK" : "Fail to get products",
      response,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductPageService = async (page = 1, limit = 3) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Product.findAndCountAll({
      offset,
      limit,
      attributes: {
        exclude: ["createdAt", "updatedAt"], // Điều chỉnh các trường cần thiết
      },
      logging: console.log,
    });

    return {
      err: 0,
      msg: "OK",
      response: {
        totalPages: Math.ceil(count / limit),
        data: rows,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET PRODUCT DETAILS
const getProductDetailsService = async (productId) => {
  try {
    const product = await Product.findByPk(productId, {
      include: [
        { model: ProductImage, attributes: ["id", "imageUrl"] },
        { model: Brand, attributes: ["id", "name"] },
        { model: Category, attributes: ["id", "name"] },
        { model: SubCategory, attributes: ["id", "subCat"] },
        { model: ChildSubCategory, attributes: ["id", "name"] },
      ],
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addProductService = async (productData, imageUrls) => {
  try {
    // Tạo sản phẩm mới
    const product = await db.Product.create(productData);

    // Tạo bản ghi hình ảnh cho sản phẩm vừa tạo
    if (imageUrls.length > 0) {
      const images = imageUrls.map((url) => ({
        product_id: product.id,
        imageUrl: url,
      }));
      await db.ProductImage.bulkCreate(images);
    }

    return {
      err: product ? 0 : 1,
      msg: product ? "Product added successfully" : "Fail to add product",
      response: product,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductService = async (productId, productData, imageUrls) => {
  const product = await Product.findByPk(productId);
  if (product) {
    await product.update(productData);
    return product;
  }
  return null;
};

const deleteProductService = async (productId) => {
  try {
    const deleted = await Product.destroy({
      where: { id: productId },
    });

    if (!deleted) {
      throw new Error("Product not found");
    }

    return {
      err: 0,
      msg: "Product deleted successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductsByCategory = async (categoryId) => {
  try {
    // Truy vấn các sản phẩm theo categoryId
    const products = await Product.findAll({
      where: { category_id: categoryId },
      include: [
        {
          model: Category,
          attributes: ["name"], // Bao gồm thông tin danh mục nếu cần
        },
        {
          model: ProductImage,
          attributes: ["imageUrl"], // Bao gồm các thông tin ảnh sản phẩm
        },
        // Bao gồm các mô hình khác ở đây nếu cần
      ],
    });

    return products;
  } catch (error) {
    console.error("Error fetching products from service:", error);
    throw error;
  }
};

const getProductsByCategoryFiter = async (categoryId, priceRange, rating) => {
    try {
        const products = await Product.findAll({
            where: {
                category_id: categoryId,
                price: {
                    [Op.between]: [parseFloat(priceRange[0]), parseFloat(priceRange[1])]
                },
                rating: {
                    [Op.gte]: parseFloat(rating)
                }
            },
            include: [
                { model: ProductImage, attributes: ['imageUrl'] }
            ]
        });
        
        return products;
    } catch (error) {
        console.error('Error fetching products from service:', error);
        throw error;
    }
};

const getProductsBySubCat = async (subCatId) => {
  try {
    // Lấy tất cả sản phẩm theo sub_category_id và bao gồm hình ảnh
    const products = await Product.findAll({
      where: {
        sub_category_id: subCatId,
      },
      include: [
        {
          model: ProductImage,
          as: "ProductImages", // Tên bí danh, sử dụng cùng tên với tên bí danh trong model
        },
      ],
    });

    // Trả về danh sách sản phẩm cùng với hình ảnh
    return products;
  } catch (error) {
    console.error("Error fetching products from database:", error);
    throw new Error("Database error");
  }
};

module.exports = {
  getProductsService,
  getProductDetailsService,
  addProductService,
  updateProductService,
  deleteProductService,
  getProductPageService,
  getProductsByCategory,
  getProductsBySubCat,
  getProductsByCategoryFiter,
};
