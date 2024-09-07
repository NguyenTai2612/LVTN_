const db = require('../models');

const { ProductImage } = db;

const addProductImageService = async (productId, imageUrl) => {
    try {
        const productImage = await ProductImage.create({
            product_id: productId,
            imageUrl: imageUrl
        });

        return {
            err: productImage ? 0 : 1,
            msg: productImage ? 'Product image added successfully' : 'Failed to add product image',
            response: productImage
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProductImageService = async (imageId, imageUrl) => {
    try {
        const [updated] = await ProductImage.update({ imageUrl: imageUrl }, {
            where: { id: imageId }
        });

        if (!updated) {
            throw new Error('Image not found');
        }

        const updatedImage = await ProductImage.findByPk(imageId);
        return {
            err: 0,
            msg: 'Product image updated successfully',
            response: updatedImage
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProductImageService = async (imageId) => {
    try {
        const deleted = await ProductImage.destroy({
            where: { id: imageId }
        });

        if (!deleted) {
            throw new Error('Image not found');
        }

        return {
            err: 0,
            msg: 'Product image deleted successfully'
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

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
    addProductImageService,
    updateProductImageService,
    deleteProductImageService,
};
