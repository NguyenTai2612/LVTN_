const ProductImagesService = require('../services/productImage');

const getProductImages = async (req, res) => {
    try {
        const { productId } = req.params;
        const response = await ProductImagesService.getProductImagesService(productId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: error.message,
        });
    }
};

const addProductImage = async (req, res) => {
    try {
        const { productId, imageUrl } = req.body;

        if (!productId || !imageUrl) {
            throw new Error("Missing required parameters: productId or imageUrl");
        }

        const response = await ProductImagesService.addProductImageService(productId, imageUrl);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at product image controller: ' + error.message,
        });
    }
};

const updateProductImage = async (req, res) => {
    try {
        const imageId = parseInt(req.params.id, 10);
        const { imageUrl } = req.body;

        if (!imageId || !imageUrl) {
            throw new Error("Missing required parameters: imageId or imageUrl");
        }

        const response = await ProductImagesService.updateProductImageService(imageId, imageUrl);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at product image controller: ' + error.message,
        });
    }
};

const deleteProductImage = async (req, res) => {
    try {
        const imageId = parseInt(req.params.id, 10);

        if (!imageId) {
            throw new Error("Missing required parameter: imageId");
        }

        const response = await ProductImagesService.deleteProductImageService(imageId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at product image controller: ' + error.message,
        });
    }
};



module.exports = {
    getProductImages,
    addProductImage,
    updateProductImage,
    deleteProductImage,
};
