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

const createProduct = async (req, res) => {
    try {
        const productData = req.body; // Assuming the product data is in the request body
        const response = await productService.createProductService(productData);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at product controller: ' + error.message
        });
    }
};

const updateProduct = async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productData = req.body;

    try {
        const response = await productService.updateProductService(productId, productData);
        res.json(response);
    } catch (error) {
        res.status(404).json({
            err: 1,
            msg: error.message
        });
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
    createProduct,
    updateProduct,
    deleteProduct,
};
