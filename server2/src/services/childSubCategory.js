const { ChildSubCategory,SubCategory,Category  } = require('../models');

const getAllChildSubCategories = async () => {
    try {
      const response = await ChildSubCategory.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: SubCategory,
            attributes: ['id', 'subCat'], // Lấy các thuộc tính cần thiết từ SubCategory
            include: [
              {
                model: Category,
                attributes: ['id', 'name'], // Lấy tên category
              },
            ],
          },
        ],
      });
  
      return { err: 0, msg: 'OK', response };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  

const getChildSubCategoryById = async (id) => {
  try {
    const childSubCategory = await ChildSubCategory.findByPk(id);
    return childSubCategory;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createChildSubCategory = async (data) => {
  try {
    const newChildSubCategory = await ChildSubCategory.create(data);
    return newChildSubCategory;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateChildSubCategory = async (id, data) => {
  try {
    const childSubCategory = await ChildSubCategory.findByPk(id);
    if (childSubCategory) {
      await childSubCategory.update(data);
      return childSubCategory;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteChildSubCategory = async (id) => {
  try {
    const deleted = await ChildSubCategory.destroy({ where: { id } });
    return deleted > 0;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllChildSubCatBySubCatId = async (sub_category_id) => {
  try {
    const response = await ChildSubCategory.findAll({
      where: { sub_category_id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllChildSubCategories,
  getChildSubCategoryById,
  createChildSubCategory,
  updateChildSubCategory,
  deleteChildSubCategory,
  getAllChildSubCatBySubCatId,
};
