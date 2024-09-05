const db = require('../models');

const cloudinary = require('cloudinary').v2;
const { Category } = require('../models');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL CATEGORIES
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

const getCategoryByIdService = async (categoryId) => {
    try {
        const category = await db.Category.findByPk(categoryId); // Tìm category theo ID

        if (!category) {
            return null; // Không tìm thấy category
        }

        return category; // Trả về category tìm được
    } catch (error) {
        throw new Error(error.message); // Xử lý lỗi nếu có
    }
};

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
//edit success


const updateCategoryService = async (categoryId, updatedData) => {
    try {
        const response = await db.Category.update(updatedData, {
            where: { id: categoryId },
            returning: true,
            plain: true,
        });

        return {
            err: response[1] ? 0 : 1,
            msg: response[1] ? 'Category updated successfully' : 'Fail to update category',
            response: response[1]
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

const getAllCategories = async () => {
    try {
        const response = await Category.findAll({
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt'] // Loại trừ các thuộc tính không cần thiết
            }
        });
        return {
            err: response.length > 0 ? 0 : 1,
            msg: response.length > 0 ? 'OK' : 'No categories found',
            response
        };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return {
            err: -1,
            msg: 'Failed to fetch categories'
        };
    }
};

module.exports = {
    getCategoriesService,
    addCategoryService,
    deleteCategoryService,
    updateCategoryService,
    getCategoryByIdService,
    getAllCategories
};
