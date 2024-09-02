const db = require('../models');

const getProductImagesService = async (productId) => {
    try {
        const images = await db.ProductImage.findAll({
            where: { product_id: productId },
            raw: true,
        });
        return {
            err: images.length ? 0 : 1,
            msg: images.length ? 'OK' : 'No images found',
            images
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getProductImagesService,
};
