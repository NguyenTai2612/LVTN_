import axiosConfig from '../axiosConfig'


export const apiGetCategories = (page = 1, limit = 3) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/category/all?page=${page}&limit=${limit}`,
        });
        resolve(response.data.response); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        reject(error);
    }
});

// export const apiGetCategoryById = (categoryId) => new Promise(async (resolve, reject) => {
//     try {
//         const response = await axiosConfig({
//             method: 'get',
//             url: `/api/v1/category/${categoryId}`, // Endpoint for fetching category by ID
//         });
//         resolve(response.data.response); // Adjust according to your API response structure
//     } catch (error) {
//         reject(error);
//     }
// });

// services/category.js

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




export const apiAddCategory = (categoryData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/category/`,
            data: categoryData, // Make sure this is correct
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});




export const apiUpdateCategory = (categoryId, updatedData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/category/${categoryId}`,
            data: updatedData
        })
        resolve(response.data)

    } catch (error) {
        reject(error)
    }
})

export const apiDeleteCategory = (categoryId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/category/${categoryId}`
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

