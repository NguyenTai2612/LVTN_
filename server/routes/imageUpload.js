const express = require('express');
const router = express.Router();
const { ImageUpload } = require('../models/imageUpload'); // Đảm bảo đường dẫn đúng

// Route để lấy danh sách các ảnh đã tải lên
router.get('/', async (req, res) => {
    try {
        const images = await ImageUpload.find({});
        if (!images.length) {
            return res.status(204).json({ message: 'No images found' });
        }
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route để xóa tất cả các ảnh
router.delete('/deleteAllImages', async (req, res) => {
    try {
        await ImageUpload.deleteMany({});
        res.status(200).json({ message: 'All images deleted successfully' });
    } catch (error) {
        console.error('Error deleting images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
