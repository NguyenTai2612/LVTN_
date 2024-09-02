const db = require('../models');
const { ProductSpecification } = db;

// GET PRODUCT SPECIFICATIONS
const getProductSpecificationsService = async (productId) => {
    try {
        const specifications = await ProductSpecification.findAll({
            where: { product_id: productId },
            raw: true
        });

        return {
            err: specifications.length > 0 ? 0 : 1,
            msg: specifications.length > 0 ? 'OK' : 'No specifications found',
            response: specifications
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getProductSpecificationsService
};
