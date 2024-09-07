const productService = require('../services/product');
const ProductImagesService = require('../services/productImage');
const cloudinary = require('cloudinary').v2;

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
            msg: 'Fail at product controller: ' + error.message
        });
    }
};

const getProductDetails = async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    try {
        const productDetails = await productService.getProductDetailsService(productId);
        res.json({ err: 0, response: productDetails });
    } catch (error) {
        res.status(404).json({ err: 1, message: error.message });
    }
};



const addProduct = async (req, res) => {
    try {
        console.log('Request Body:', req.body);  // Log form fields
        console.log('Files:', req.files);         // Log file details

        const { name, description, price, oldPrice, brand_id, category_id, sub_category_id, countInStock, rating, isFeatured, discount } = req.body;

        if (!name || !description || !price || !oldPrice || !brand_id || !category_id || !countInStock) {
            throw new Error('Missing required fields');
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
            countInStock,
            rating,
            isFeatured,
            discount
        };

        // Tạo sản phẩm mới và lưu hình ảnh vào bảng ProductImage
        const response = await productService.addProductService(productData, imageUrls);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at product controller: ' + error.message,
        });
    }
};


const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;  // Đảm bảo biến productId được lấy từ URL params
        const { name, description, price, oldPrice, countInStock, rating, isFeatured, discount, brand_id, category_id, sub_category_id } = req.body;
        const images = req.files;

        if (!productId) {
            return res.status(400).json({ err: -1, msg: 'Product ID is required' });
        }

        if (!name || !description || !price || !countInStock) {
            return res.status(400).json({ err: -1, msg: 'No valid data provided for update' });
        }

        // Cập nhật thông tin sản phẩm qua service
        const updatedProduct = await productService.updateProductService(productId, {
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
            sub_category_id
        });

        if (!updatedProduct) {
            return res.status(404).json({ err: -1, msg: 'Product not found' });
        }

       
        res.status(200).json({ err: 0, msg: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ err: -1, msg: error.message });
    }
};


const deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    try {
        const response = await productService.deleteProductService(productId);
        res.json(response);
    } catch (error) {
        res.status(404).json({
            err: 1,
            msg: error.message
        });
    }
};

// Exporting the function
module.exports = {
    getProducts,
    getProductDetails,
    addProduct,
    updateProduct,
    deleteProduct,
};
