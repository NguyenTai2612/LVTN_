const { Product, ProductImage, ProductSpecification } = require('../models'); // Import các model cần thiết

// Xóa nhiều sản phẩm cùng với ảnh và thông số
const deleteMultipleProducts = async (req, res) => {
  const { productIds } = req.body; // Lấy danh sách ID sản phẩm từ request body

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Danh sách ID sản phẩm không hợp lệ.' });
  }

  try {
    // Xóa ảnh sản phẩm liên quan
    await ProductImage.destroy({
      where: {
        product_id: productIds
      }
    });

    // Xóa thông số sản phẩm liên quan
    await ProductSpecification.destroy({
      where: {
        product_id: productIds
      }
    });

    // Xóa sản phẩm
    const deleted = await Product.destroy({
      where: {
        id: productIds
      }
    });

    if (deleted > 0) {
      res.status(200).json({ message: `Đã xóa ${deleted} sản phẩm thành công.` });
    } else {
      res.status(404).json({ error: 'Không tìm thấy sản phẩm để xóa.' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi xóa sản phẩm.' });
  }
};

// Xóa nhiều ảnh sản phẩm
const deleteMultipleProductImages = async (req, res) => {
  const { imageIds } = req.body; // Lấy danh sách ID ảnh sản phẩm từ request body

  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    return res.status(400).json({ error: 'Danh sách ID ảnh sản phẩm không hợp lệ.' });
  }

  try {
    const deleted = await ProductImage.destroy({
      where: {
        id: imageIds
      }
    });

    if (deleted > 0) {
      res.status(200).json({ message: `Đã xóa ${deleted} ảnh sản phẩm thành công.` });
    } else {
      res.status(404).json({ error: 'Không tìm thấy ảnh sản phẩm để xóa.' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa ảnh sản phẩm:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi xóa ảnh sản phẩm.' });
  }
};

// Xóa nhiều thông số sản phẩm
const deleteMultipleProductSpecifications = async (req, res) => {
  const { specIds } = req.body; // Lấy danh sách ID thông số sản phẩm từ request body

  if (!Array.isArray(specIds) || specIds.length === 0) {
    return res.status(400).json({ error: 'Danh sách ID thông số sản phẩm không hợp lệ.' });
  }

  try {
    const deleted = await ProductSpecification.destroy({
      where: {
        id: specIds
      }
    });

    if (deleted > 0) {
      res.status(200).json({ message: `Đã xóa ${deleted} thông số sản phẩm thành công.` });
    } else {
      res.status(404).json({ error: 'Không tìm thấy thông số sản phẩm để xóa.' });
    }
  } catch (error) {
    console.error('Lỗi khi xóa thông số sản phẩm:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi xóa thông số sản phẩm.' });
  }
};

module.exports = {
  deleteMultipleProducts,
  deleteMultipleProductImages,
  deleteMultipleProductSpecifications
};
