import axiosConfig from '../axiosConfig';



export const apiGetSubCategories = (page = 1, limit = 3) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/subCategory/all?page=${page}&limit=${limit}`,
        });
        resolve(response.data.response); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        reject(error);
    }
});

export const apiGetAllSubCategories = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/subcategory', // Adjust the URL path based on your API endpoint
        });
        resolve(response.data.response); // Ensure to return the correct data from the API
    } catch (error) {
        reject(error);
    }
});

// Get a subcategory by ID
export const apiGetSubCategoryById = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/subCategory/${id}`,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to fetch subcategory' });
    }
});

// Create a new subcategory
export const apiCreateSubCategory = (data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/subCategory',
            data,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to create subcategory' });
    }
});

// Update a subcategory by ID
export const apiUpdateSubCategory = (id, data) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/subCategory/${id}`,
            data,
        });
        resolve(response.data);
    } catch (error) {
        reject({ err: -1, msg: 'Failed to update subcategory' });
    }
});

// Delete a subcategory by ID
export const apiDeleteSubCategory = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/subCategory/${id}`,
        });
        console.log('API response status:', response.status); // Log the status for debugging
        
        // Check for 200 status as well, assuming 200 indicates successful deletion
        if (response.status === 200 || response.status === 204) {
            resolve({ err: 0, msg: 'Subcategory deleted successfully' });
        } else {
            reject({ err: -1, msg: 'Failed to delete subcategory' });
        }
    } catch (error) {
        console.error('API request error:', error); // Log full error for debugging
        reject({ err: -1, msg: 'Failed to delete subcategory' });
    }
});

