const services = require('../services/product');
const productService = require('../services/product');

const getProducts = async (req, res) => {
    try {
        const response = await services.getProductsService();
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

// Exporting the function
module.exports = {
    getProducts,
    getProductDetails,
};
