const db = require('../models');

// GET ALL CATEGORIES
// const getCategoriesService = async () => {
//     try {
//         const response = await db.Category.findAll({ 
//             raw: true,
//             attributes: {
//                 exclude: ['createdAt', 'updatedAt', 'description']
//             }
//          });
//         return {
//             err: response ? 0 : 1,
//             msg: response ? 'OK' : 'Fail to get categories',
//             response
//         };
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

const getCategoriesService = async (page = 1, limit = 3) => {
    try {
        console.log(`Page: ${page}`); // Debug giá trị page
        const offset = (page - 1) * limit;
        console.log(`OFFSET: ${offset}, LIMIT: ${limit}`);
        
        const { count, rows } = await db.Category.findAndCountAll({
            offset,
            limit,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'description']
            },
            logging: console.log
        });

        return {
            err: 0,
            msg: 'OK',
            response: {
                totalPages: Math.ceil(count / limit),
                data: rows
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


//edit

const addCategoryService = async (categoryData) => {
    try {
        const response = await db.Category.create(categoryData);
        return {
            err: response ? 0 : 1,
            msg: response ? 'Category added successfully' : 'Fail to add category',
            response
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteCategoryService = async (categoryId) => {
    try {
        const response = await db.Category.destroy({
            where: { id: categoryId }
        });
        return {
            err: response ? 0 : 1,
            msg: response ? 'Category deleted successfully' : 'Fail to delete category',
            response
        };
    } catch (error) {
        throw new Error(error.message);
    }
};



module.exports = {
    getCategoriesService,
    addCategoryService,
    deleteCategoryService,
};
