const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Product, ProductImage, ProductSpecification } = require('../models'); // Điều chỉnh đường dẫn models

const router = express.Router();

// Cấu hình multer để lưu file tạm thời
const upload = multer({ dest: 'uploads/' });

router.post('/import-csv', upload.single('csvFile'), (req, res) => {
  const filePath = req.file.path;

  // Đọc và xử lý file CSV
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      try {
        // Tạo sản phẩm
        const product = await Product.create({
          name: row.name,
          description: row.description,
          price: parseFloat(row.price),
          oldPrice: row.old_price !== '' ? parseFloat(row.old_price) : null,
          brand_id: parseInt(row.brand_id),
          category_id: parseInt(row.category_id),
          sub_category_id: parseInt(row.sub_category_id),
          countInStock: parseInt(row.count_in_stock),
          rating: parseFloat(row.rating),
          isFeatured: row.is_featured === '1',
          discount: parseFloat(row.discount),
        });

        // Thêm hình ảnh
        const imageUrls = row.images.split(';').map(url => url.trim());
        for (const url of imageUrls) {
          await ProductImage.create({
            product_id: product.id,
            imageUrl: url
          });
        }

        // Thêm thông số kỹ thuật
        if (row.specifications) {
          const specs = row.specifications.split(';').map(spec => {
            const [key, value] = spec.split(':').map(item => item.trim());
            return { key, value };
          });

          for (const { key, value } of specs) {
            await ProductSpecification.create({
              product_id: product.id,
              spec_key: key,
              spec_value: value
            });
          }
        }
      } catch (error) {
        console.error('Error processing row:', error.message);
      }
    })
    .on('end', () => {
      // Xóa file sau khi xử lý
      fs.unlinkSync(filePath);
      res.json({ message: 'File uploaded and processed successfully' });
    });
});

module.exports = router;
