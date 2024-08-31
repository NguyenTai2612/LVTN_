const db = require('../models');

// GET ALL CATEGORIES
const getCategoriesService = async () => {
    try {
        const response = await db.Category.findAll({ 
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'description']
            }
         });
        return {
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Fail to get categories',
            response
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    getCategoriesService,
};
