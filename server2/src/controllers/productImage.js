const ProductImagesService = require('../services/productImage');
const { ProductImage } = require('../models'); 

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

// Controller để xóa tất cả hình ảnh của sản phẩm theo product_id
const deleteProductImagesByProductId = async (req, res) => {
    const { productId } = req.params;

    try {
        // Xóa tất cả hình ảnh của sản phẩm có product_id được chỉ định
        const deletedImagesCount = await ProductImage.destroy({
            where: {
                product_id: productId
            }
        });

        if (deletedImagesCount > 0) {
            res.status(200).json({
                err: 0,
                msg: `Deleted ${deletedImagesCount} image(s) for product ID ${productId} successfully`
            });
        } else {
            res.status(404).json({
                err: 1,
                msg: `No images found for product ID ${productId}`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            err: 1,
            msg: 'Error deleting product images',
            error: error.message
        });
    }
};



module.exports = {
    getProductImages,
    addProductImage,
    updateProductImage,
    deleteProductImage,
    deleteProductImagesByProductId
};
