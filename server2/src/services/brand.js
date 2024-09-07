const db = require('../models');

const cloudinary = require('cloudinary').v2;
const { Brand } = require('../models');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL CATEGORIES
const getBrandService = async (page = 1, limit = 3) => {
    try {
        console.log(`Page: ${page}`); // Debug giá trị page
        const offset = (page - 1) * limit;
        console.log(`OFFSET: ${offset}, LIMIT: ${limit}`);
        
        const { count, rows } = await db.Brand.findAndCountAll({
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

const getBrandByIdService = async (brandId) => {
    try {
        const brand = await db.Brand.findByPk(brandId); // Tìm category theo ID

        if (!brand) {
            return null; // Không tìm thấy category
        }

        return brand; // Trả về category tìm được
    } catch (error) {
        throw new Error(error.message); // Xử lý lỗi nếu có
    }
};

const addBrandService = async (brandData) => {
    try {
        const response = await db.Brand.create(brandData);
        return {
            err: response ? 0 : 1,
            msg: response ? 'Brand added successfully' : 'Fail to add Brand',
            response
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
//edit success


const updateBrandService = async (categoryId, updatedData) => {
    try {
        const response = await db.Brand.update(updatedData, {
            where: { id: categoryId },
            returning: true,
            plain: true,
        });

        return {
            err: response[1] ? 0 : 1,
            msg: response[1] ? 'Brand updated successfully' : 'Fail to update Brand',
            response: response[1]
        };
    } catch (error) {
        throw new Error(error.message);
    }
};



const deleteBrandService = async (brandId) => {
    try {
        const response = await db.Brand.destroy({
            where: { id: brandId }
        });
        return {
            err: response ? 0 : 1,
            msg: response ? 'Brand deleted successfully' : 'Fail to delete Brand',
            response
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllBrand = async () => {
    try {
        const response = await Brand.findAll({
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt'] // Loại trừ các thuộc tính không cần thiết
            }
        });
        return {
            err: response.length > 0 ? 0 : 1,
            msg: response.length > 0 ? 'OK' : 'No Brand found',
            response
        };
    } catch (error) {
        console.error('Error fetching Brand:', error);
        return {
            err: -1,
            msg: 'Failed to fetch Brand'
        };
    }
};

module.exports = {
    getBrandService,
    addBrandService,
    deleteBrandService,
    updateBrandService,
    getBrandByIdService,
    getAllBrand
};
