const db = require('../models');
const { Product, ProductImage, Brand, Category, SubCategory } = db;
const cloudinary = require('cloudinary').v2;

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
                exclude: ['createdAt', 'updatedAt', 'description']
            }
        });
        return {
            err: response.length > 0 ? 0 : 1,
            msg: response.length > 0 ? 'OK' : 'Fail to get products',
            response
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
                { model: ProductImage, attributes: ['id', 'imageUrl'] },
                { model: Brand, attributes: ['id', 'name'] },
                { model: Category, attributes: ['id', 'name'] },
                { model: SubCategory, attributes: ['id', 'subCat'] }
            ]
        });

        if (!product) {
            throw new Error('Product not found');
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
            const images = imageUrls.map(url => ({
                product_id: product.id,
                imageUrl: url
            }));
            await db.ProductImage.bulkCreate(images);
        }
        
        return {
            err: product ? 0 : 1,
            msg: product ? 'Product added successfully' : 'Fail to add product',
            response: product
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
            where: { id: productId }
        });

        if (!deleted) {
            throw new Error('Product not found');
        }

        return {
            err: 0,
            msg: 'Product deleted successfully'
        };
    } catch (error) {
        throw new Error(error.message);
    }
};



module.exports = {
    getProductsService,
    getProductDetailsService,
    addProductService,
    updateProductService,
    deleteProductService,
};
