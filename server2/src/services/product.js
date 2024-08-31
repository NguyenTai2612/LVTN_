const db = require('../models');

// GET ALL PRODUCTS
const getProductsService = async () => {
    try {
        const response = await db.Product.findAll({ 
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'description'] // Modify fields as needed
            }
        });
        return {
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Fail to get products',
            response
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getProductsService,
};
