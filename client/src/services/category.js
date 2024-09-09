import axiosConfig from '../axiosConfig'


export const apiGetCategories = (page = 1, limit = 10) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/category/all?page=${page}&limit=${limit}`,
        });
        resolve(response.data); 
    } catch (error) {
        reject(error);
    }
});


export const apiGetCategoryById = (categoryId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/category/${categoryId}`, // Endpoint for fetching category by ID
        });
        resolve(response.data); // Adjust according to your API response structure
    } catch (error) {
        reject(error);
    }
});