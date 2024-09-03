const services = require('../services/category');

// const getCategories = async (req, res) => {
//     try {
//         const response = await services.getCategoriesService();
//         return res.status(200).json(response);
//     } catch (error) {
//         return res.status(500).json({
//             err: -1,
//             msg: 'Fail at category controller: ' + error
//         });
//     }
// };

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
        const { name, image } = req.body;
        const response = await services.addCategoryService({ name, image });
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at category controller: ' + error
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


// Exporting the function
module.exports = {
    getCategories,
    addCategory,
    deleteCategory,
};
