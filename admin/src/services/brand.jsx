import axiosConfig from '../axiosConfig'


export const apiGetBrand = (page = 1, limit = 3) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/brand/all?page=${page}&limit=${limit}`,
        });
        resolve(response.data.response); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        reject(error);
    }
});

export const apiGetAllBrand = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/brand',
        });
        resolve(response.data.response); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        reject(error);
    }
});


export const apiGetBrandById = (brandId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/brand/${brandId}`, // Endpoint for fetching brand by ID
        });
        resolve(response.data); // Adjust according to your API response structure
    } catch (error) {
        reject(error);
    }
});




export const apiAddBrand = (brandData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/brand/`,
            data: brandData, // Make sure this is correct
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});




export const apiUpdateBrand = (brandId, updatedData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/brand/${brandId}`,
            data: updatedData
        })
        resolve(response.data)

    } catch (error) {
        reject(error)
    }
})

export const apiDeleteBrand = (brandId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/brand/${brandId}`
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

