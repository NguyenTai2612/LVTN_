import axiosConfig from '../axiosConfig';


export const apiGetProductSpecifications = (productId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/productSpecification/${productId}`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
