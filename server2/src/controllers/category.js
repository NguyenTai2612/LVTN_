const services = require('../services/category');

const db = require('../models');


const getCategories = async (req, res) => {
    try {
        // Lấy các giá trị từ query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        // console.log('Page:', page);
        const response = await services.getCategoriesService(page, limit);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ err: 1, msg: error.message });
    }
};

const addCategory = async (req, res) => {
    try {
        console.log('Request Body:', req.body);  // Log form fields
        console.log('File:', req.file);          // Log file details

        const { name } = req.body;
        const image = req.file ? req.file.buffer : null;

        if (!name || !image) {
            throw new Error("Missing required parameters: name or image");
        }

        const imageUrl = req.body.image_url || null;

        const response = await services.addCategoryService({ name, image: imageUrl });
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at category controller: ' + error.message,
        });
    }
};
//success



// const updateCategory = async (req, res) => {
//     try {
//         const { categoryId } = req.params;
//         const { name, image } = req.body;

//         if (!name && !image) {
//             throw new Error("Missing required parameters: name or image");
//         }

//         const updatedData = {};
//         if (name) updatedData.name = name;
//         if (image) updatedData.image = image;

//         const response = await services.updateCategoryService(categoryId, updatedData);
//         return res.status(200).json(response);
//     } catch (error) {
//         return res.status(500).json({
//             err: -1,
//             msg: 'Fail at category controller: ' + error
//         });
//     }
// };

const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        const image = req.file ? req.file.buffer.toString('base64') : req.body.image_url;

        if (!name && !image) {
            throw new Error("Missing required parameters: name or image");
        }

        const updatedData = {};
        if (name) updatedData.name = name;
        if (image) updatedData.image = image;

        const response = await services.updateCategoryService(categoryId, updatedData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at category controller: ' + error.message
        });
    }
};





const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const response = await services.deleteCategoryService(categoryId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at category controller: ' + error
        });
    }
};




const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await services.getCategoryByIdService(categoryId); // Gọi service để lấy dữ liệu

        if (!category) {
            return res.status(404).json({ err: 1, msg: 'Category not found' });
        }

        res.status(200).json({
            err: 0,
            msg: 'Category retrieved successfully',
            response: category
        });
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Error retrieving category: ' + error.message });
    }
};

//edit 
const getAllCategories = async (req, res) => {
    try {
        const result = await services.getAllCategories();
        if (result.err === 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getAllCategories controller:', error);
        res.status(500).json({
            err: -1,
            msg: 'Failed to fetch categories'
        });
    }
};

// Exporting the function
module.exports = {
    getCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
};
