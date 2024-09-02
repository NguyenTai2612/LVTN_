const productSpecificationService = require('../services/productSpecification');

const getProductSpecifications = async (req, res) => {
    const productId = parseInt(req.params.productId, 10); // Đổi thành productId

    if (isNaN(productId)) {
        return res.status(400).json({
            err: -1,
            msg: 'Invalid product ID'
        });
    }

    try {
        const { err, response, msg } = await productSpecificationService.getProductSpecificationsService(productId);

        if (err) {
            return res.status(404).json({ err, msg });
        }

        return res.status(200).json({ err, response });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at productSpecification controller: ' + error.message
        });
    }
};

module.exports = {
    getProductSpecifications
};
