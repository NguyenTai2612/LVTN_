const db = require('../models');
const { Product, ProductImage, Brand, Category, SubCategory } = db;

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

module.exports = {
    getProductsService,
    getProductDetailsService,
};
