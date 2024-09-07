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

const getProductSpecificationById = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ err: -1, msg: 'Invalid specification ID' });
    }

    try {
        const { err, response, msg } = await productSpecificationService.getProductSpecificationByIdService(id);

        if (err) {
            return res.status(404).json({ err, msg });
        }

        return res.status(200).json({ err, response });
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Error: ' + error.message });
    }
};

const createProductSpecification = async (req, res) => {
    const specData = req.body;

    try {
        const { err, response, msg } = await productSpecificationService.createProductSpecificationService(specData);

        if (err) {
            return res.status(400).json({ err, msg });
        }

        return res.status(201).json({ err, response });
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Error: ' + error.message });
    }
};

const updateProductSpecification = async (req, res) => {
    const specId = parseInt(req.params.id, 10);
    const { spec_key, spec_value } = req.body;

    if (isNaN(specId)) {
        return res.status(400).json({
            err: -1,
            msg: 'Invalid specification ID'
        });
    }

    try {
        const result = await productSpecificationService.updateProductSpecificationService(specId, { spec_key, spec_value });

        if (result.err) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at productSpecification controller: ' + error.message
        });
    }
};

const deleteProductSpecification = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).json({ err: -1, msg: 'Invalid specification ID' });
    }

    try {
        const { err, msg } = await productSpecificationService.deleteProductSpecificationService(id);

        if (err) {
            return res.status(404).json({ err, msg });
        }

        return res.status(200).json({ err, msg });
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Error: ' + error.message });
    }
};

module.exports = {
    getProductSpecifications,
    getProductSpecificationById,
    createProductSpecification,
    updateProductSpecification,
    deleteProductSpecification
};
