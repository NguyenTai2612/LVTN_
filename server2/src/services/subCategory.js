const { SubCategory } = require('../models');
const db = require('../models');

const getSubCategoriesService = async (page = 1, limit = 3) => {
    try {
        const offset = (page - 1) * limit;

        const { count, rows } = await db.SubCategory.findAndCountAll({
            offset,
            limit,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: db.Category, // Không cần alias nếu không định nghĩa trong association
                    attributes: ['id', 'name', 'image']
                }
            ],
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

const getAllSubCategories = async () => {
    try {
        const response = await SubCategory.findAll({
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt'] // Exclude unnecessary attributes
            }
        });
        return {
            err: response.length > 0 ? 0 : 1,
            msg: response.length > 0 ? 'OK' : 'No subcategories found',
            response
        };
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return {
            err: -1,
            msg: 'Failed to fetch subcategories'
        };
    }
};

const getSubCategoryById = async (id) => {
    return await SubCategory.findByPk(id);
};

const createSubCategory = async (subCategoryData) => {
    try {
        // Create a new subcategory using the data provided
        const newSubCategory = await SubCategory.create(subCategoryData);
        return newSubCategory;
    } catch (error) {
        // If an error occurs, throw it so it can be caught in the controller
        throw new Error('Error creating subcategory: ' + error.message);
    }
};

const updateSubCategory = async (id, updatedData) => {
    const subCategory = await SubCategory.findByPk(id);
    if (subCategory) {
        await subCategory.update(updatedData);
        return subCategory;
    } else {
        throw new Error('SubCategory not found');
    }
};

const deleteSubCategory = async (id) => {
    try {
        const deletedCount = await SubCategory.destroy({
            where: { id }
        });
        return deletedCount > 0; // Return true if something was deleted
    } catch (error) {
        throw new Error('Error deleting subcategory: ' + error.message);
    }
};

const getCategoryBySubCategoryId = async (subCatId) => {
    try {
        
        const subCategory = await db.SubCategory.findOne({
            where: { id: subCatId },
            include: [{
                model: db.Category, // Mối quan hệ giữa SubCategory và Category
                attributes: ['id', 'name'] // Chỉ lấy id và name của Category
            }]
        });

        if (!subCategory) {
            return null;
        }

        return subCategory.Category; // Trả về thông tin Category
    } catch (error) {
        console.error("Error in getCategoryBySubCategoryId:", error);
        throw error;
    }
};

const getAllSubCatByCatIdService = async (categoryId) => {
    try {
      const subCategories = await SubCategory.findAll({
        where: { category_id: categoryId }
      });
      return subCategories;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  

module.exports = {
    getSubCategoriesService,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
    createSubCategory,
    getAllSubCategories,
    getCategoryBySubCategoryId,
    getAllSubCatByCatIdService
};
