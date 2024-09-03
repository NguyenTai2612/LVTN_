import axiosConfig from '../axiosConfig';

export const apiGetProductImages = (productId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/productImage/${productId}/images`,
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});
