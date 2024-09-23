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
      attributes: ['id', 'name', 'price', 'oldPrice', 'rating', 'discount'] // Thêm rating và discount
    });

    // Trả về kết quả
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};
