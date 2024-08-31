const services = require('../services/product');

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

// Exporting the function
module.exports = {
    getProducts,
};
