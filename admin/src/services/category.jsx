import axiosConfig from '../axiosConfig'

// src/utils/api.js

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


// export const apiGetCategories = () => new Promise(async (resolve, reject) => {
//     try {
//         const response = await axiosConfig({
//             method: 'get',
//             url: '/api/v1/category/all',
//         })
//         resolve(response)

//     } catch (error) {
//         reject(error)
//     }
// })
//edit

export const apiUpdateCategory = (categoryId, updatedData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/category/${categoryId}`,
            data: updatedData
        })
        resolve(response)

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

