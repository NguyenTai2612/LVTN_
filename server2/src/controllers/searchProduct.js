// controllers/searchProduct.js
const { Product, ProductImage } = require('../models');
const { Op } = require('sequelize');

exports.searchProductsByName = async (req, res) => {
  try {
    const { name } = req.query;

    // Kiểm tra từ khóa tìm kiếm
    if (!name) {
      return res.status(400).json({ message: 'Từ khóa tìm kiếm không được bỏ trống' });
    }

    // Tìm kiếm sản phẩm có tên gần đúng với từ khóa
    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%` // Tìm kiếm theo tên chứa từ khóa
        }
      },
      include: [{ model: ProductImage }], // Bao gồm ảnh sản phẩm (nếu có)
      attributes: ['id', 'name', 'price', 'oldPrice', 'rating', 'discount', 'countInStock'] // Thêm rating và discount
    });

    // Trả về kết quả
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Tìm kiếm sản phẩm theo ID
exports.searchProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra nếu không có ID
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(productId, {
      include: [{ model: ProductImage }] // Bao gồm ảnh sản phẩm
    });

    // Kiểm tra nếu sản phẩm không tồn tại
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Trả về sản phẩm tìm được
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};
