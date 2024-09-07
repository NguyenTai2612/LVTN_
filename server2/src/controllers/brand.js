const services = require('../services/brand');

const db = require('../models');


const getBrand = async (req, res) => {
    try {
        // Lấy các giá trị từ query params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;

        // console.log('Page:', page);
        const response = await services.getBrandService(page, limit);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ err: 1, msg: error.message });
    }
};

const addBrand = async (req, res) => {
    try {
        console.log('Request Body:', req.body);  // Log form fields
        console.log('File:', req.file);          // Log file details

        const { name } = req.body;
        const image = req.file ? req.file.buffer : null;

        if (!name || !image) {
            throw new Error("Missing required parameters: name or image");
        }

        const imageUrl = req.body.image_url || null;

        const response = await services.addBrandService({ name, image: imageUrl });
        return res.status(201).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at brand controller: ' + error.message,
        });
    }
};
//success



const updateBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const { name } = req.body;
        const image = req.file ? req.file.buffer.toString('base64') : req.body.image_url;

        if (!name && !image) {
            throw new Error("Missing required parameters: name or image");
        }

        const updatedData = {};
        if (name) updatedData.name = name;
        if (image) updatedData.image = image;

        const response = await services.updateBrandService(brandId, updatedData);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at brand controller: ' + error.message
        });
    }
};





const deleteBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const response = await services.deleteBrandService(brandId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at category controller: ' + error
        });
    }
};




const getBrandById = async (req, res) => {
    try {
        const { brandId } = req.params;
        const brand = await services.getBrandByIdService(brandId); // Gọi service để lấy dữ liệu

        if (!brand) {
            return res.status(404).json({ err: 1, msg: 'Brand not found' });
        }

        res.status(200).json({
            err: 0,
            msg: 'Brand retrieved successfully',
            response: brand
        });
    } catch (error) {
        res.status(500).json({ err: 1, msg: 'Error retrieving brand: ' + error.message });
    }
};

//edit 
const getAllBrand = async (req, res) => {
    try {
        const result = await services.getAllBrand();
        if (result.err === 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Error in getAllBrand controller:', error);
        res.status(500).json({
            err: -1,
            msg: 'Failed to fetch categories'
        });
    }
};

// Exporting the function
module.exports = {
    getBrand,
    addBrand,
    deleteBrand,
    updateBrand,
    getBrandById,
    getAllBrand,
};
