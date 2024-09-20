const childSubCatService = require('../services/childSubCategory');

const getAllChildSubCategories = async (req, res) => {
  try {
    const response = await childSubCatService.getAllChildSubCategories();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ err: 1, msg: error.message });
  }
};

const getChildSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await childSubCatService.getChildSubCategoryById(id);
    if (response) {
      res.status(200).json({ err: 0, response });
    } else {
      res.status(404).json({ err: -1, msg: 'Child SubCategory not found' });
    }
  } catch (error) {
    res.status(500).json({ err: 1, msg: error.message });
  }
};

const createChildSubCategory = async (req, res) => {
  try {
    const { sub_category_id, name } = req.body;
    const response = await childSubCatService.createChildSubCategory({ sub_category_id, name });
    res.status(201).json({ err: 0, response });
  } catch (error) {
    res.status(500).json({ err: 1, msg: error.message });
  }
};

const updateChildSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { sub_category_id, name } = req.body;
    const response = await childSubCatService.updateChildSubCategory(id, { sub_category_id, name });
    if (response) {
      res.status(200).json({ err: 0, response });
    } else {
      res.status(404).json({ err: -1, msg: 'Child SubCategory not found' });
    }
  } catch (error) {
    res.status(500).json({ err: 1, msg: error.message });
  }
};

const deleteChildSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await childSubCatService.deleteChildSubCategory(id);
    if (deleted) {
      res.status(200).json({ err: 0, msg: 'Child SubCategory successfully deleted' });
    } else {
      res.status(404).json({ err: -1, msg: 'Child SubCategory not found' });
    }
  } catch (error) {
    res.status(500).json({ err: 1, msg: error.message });
  }
};

const getAllChildSubCatBySubCatId = async (req, res) => {
  try {
    const { subCatId } = req.params;
    const response = await childSubCatService.getAllChildSubCatBySubCatId(subCatId);
    res.status(200).json({ err: 0, response });
  } catch (error) {
    res.status(500).json({ err: 1, msg: error.message });
  }
};

module.exports = {
  getAllChildSubCategories,
  getChildSubCategoryById,
  createChildSubCategory,
  updateChildSubCategory,
  deleteChildSubCategory,
  getAllChildSubCatBySubCatId
};
