import axiosConfig from '../axiosConfig'


export const apiGetCategories = (page = 1, limit = 6) => new Promise(async (resolve, reject) => {
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
