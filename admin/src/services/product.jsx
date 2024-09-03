import axiosConfig from '../axiosConfig'

export const apiGetProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/product/all',  // Điều chỉnh URL nếu cần
        })
        resolve(response)

    } catch (error) {
        reject(error)
    }
})

export const apiGetProductDetails = (productId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/product/${productId}/details`,  // Điều chỉnh URL nếu cần
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});



