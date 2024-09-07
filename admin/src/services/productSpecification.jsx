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

export const apiCreateProductSpecification = (specData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/productSpecification/create',
            data: specData,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiUpdateProductSpecification = (specId, updatedData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/productSpecification/${specId}/update`,
            data: updatedData,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

export const apiDeleteProductSpecification = (specId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/productSpecification/${specId}/delete`,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
