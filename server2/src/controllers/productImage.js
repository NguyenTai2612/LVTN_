const { getProductImagesService } = require('../services/productImage');

const getProductImages = async (req, res) => {
    try {
        const { productId } = req.params;
        const response = await getProductImagesService(productId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: error.message,
        });
    }
};

module.exports = {
    getProductImages,
};
