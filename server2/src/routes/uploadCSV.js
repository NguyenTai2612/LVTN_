const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { Product, ProductImage, ProductSpecification } = require("../models"); // Điều chỉnh đường dẫn models

const router = express.Router();

// Cấu hình multer để lưu file tạm thời
const upload = multer({ dest: "uploads/" });

// Thay upload.single bằng upload.array để cho phép nhiều file
router.post("/import-csv", upload.array("csvFiles"), (req, res) => {
  const files = req.files;

  // Kiểm tra nếu không có file được upload
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Lặp qua từng file được upload
  files.forEach((file) => {
    const filePath = file.path;

    // Đọc và xử lý từng file CSV
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        try {
          // Tạo sản phẩm và giữ nguyên sub_category_id và child_sub_category_id dù là 0
          const product = await Product.create({
            name: row.name,
            description: row.description,
            price: parseFloat(row.price),
            oldPrice: row.old_price !== '' ? parseFloat(row.old_price) : null,
            brand_id: row.brand_id !== '0' ? parseInt(row.brand_id) : null,
            category_id: parseInt(row.category_id),
            sub_category_id: row.sub_category_id !== '0' ? parseInt(row.sub_category_id) : null,  // NULL if 0
            child_sub_category_id: row.child_sub_category_id !== '0' ? parseInt(row.child_sub_category_id) : null,  // NULL if 0
            countInStock: parseInt(row.count_in_stock),
            rating: parseFloat(row.rating),
            isFeatured: row.is_featured === '1',
            discount: parseFloat(row.discount),
          });
          

          // Thêm hình ảnh
          const imageUrls = row.images.split(";").map((url) => url.trim());
          for (const url of imageUrls) {
            await ProductImage.create({
              product_id: product.id,
              imageUrl: url,
            });
          }

          // Thêm thông số kỹ thuật
          if (row.specifications) {
            const specs = row.specifications.split(";").map((spec) => {
              const [key, value] = spec.split(":").map((item) => item.trim());
              return { key, value };
            });

            for (const { key, value } of specs) {
              await ProductSpecification.create({
                product_id: product.id,
                spec_key: key,
                spec_value: value,
              });
            }
          }
        } catch (error) {
          console.error("Error processing row:", error.message);
        }
      })
      .on("end", () => {
        // Xóa file sau khi xử lý
        fs.unlinkSync(filePath);
      });
  });

  // Sau khi tất cả các file được xử lý, trả về phản hồi
  res.json({ message: "All files uploaded and processed successfully" });
});

module.exports = router;
