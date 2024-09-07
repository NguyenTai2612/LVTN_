const db = require('../models');
const { ProductSpecification } = db;

// GET PRODUCT SPECIFICATIONS
const getProductSpecificationsService = async (productId) => {
    try {
        const specifications = await ProductSpecification.findAll({
            where: { product_id: productId },
            raw: true
        });

        return {
            err: specifications.length > 0 ? 0 : 1,
            msg: specifications.length > 0 ? 'OK' : 'No specifications found',
            response: specifications
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getProductSpecificationByIdService = async (id) => {
    try {
        const specification = await ProductSpecification.findByPk(id);

        if (!specification) {
            return { err: 1, msg: 'Specification not found', response: null };
        }

        return { err: 0, msg: 'OK', response: specification };
    } catch (error) {
        throw new Error(error.message);
    }
};

const createProductSpecificationService = async (specData) => {
    try {
        const newSpecification = await ProductSpecification.create(specData);
        return { err: 0, msg: 'Specification created successfully', response: newSpecification };
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProductSpecificationService = async (specId, updateData) => {
    try {
        const [updated] = await ProductSpecification.update(updateData, {
            where: { id: specId }
        });

        if (updated) {
            const updatedSpecification = await ProductSpecification.findByPk(specId);
            return {
                err: 0,
                response: updatedSpecification,
                msg: 'Specification updated successfully'
            };
        }

        return {
            err: 1,
            msg: 'Specification not found'
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteProductSpecificationService = async (id) => {
    try {
        const deleted = await ProductSpecification.destroy({ where: { id } });

        if (deleted) {
            return { err: 0, msg: 'Specification deleted successfully' };
        }

        return { err: 1, msg: 'Specification not found' };
    } catch (error) {
        throw new Error(error.message);
    }
};


module.exports = {
    getProductSpecificationsService,
    getProductSpecificationByIdService,
    createProductSpecificationService,
    updateProductSpecificationService,
    deleteProductSpecificationService
};
