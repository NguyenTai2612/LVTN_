const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Thiết lập multer để lưu trữ tệp tạm thời
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route tìm sản phẩm tương tự từ ảnh
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const formData = new FormData();
  formData.append('image', req.file.buffer, req.file.originalname);

  try {
    // Gọi API Python để tìm sản phẩm tương tự
    const response = await axios.post('http://localhost:5001/find-similar', formData, {
      headers: {
        ...formData.getHeaders(), // Đảm bảo gửi đúng header
      },
    });

    // Giả sử API trả về danh sách sản phẩm tương tự
    res.json({ similarProducts: response.data });
  } catch (error) {
    console.error("Error calling Python API:", error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
