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

export const apiCreateProductSpecification = (product_id, specData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/productSpecification/create',
            data: { product_id, ...specData }, // Kết hợp product_id với specData
        });
        resolve(response.data);  // Trả về dữ liệu phản hồi từ API
    } catch (error) {
        // Trả về thông tin lỗi chi tiết
        console.error('Error creating product specification:', error.response || error.message || error);
        reject(error.response ? error.response.data : error.message || 'Unknown error');
    }
});


export const apiUpdateProductSpecification = async (specId, updatedData) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/productSpecification/${specId}/update`,
            data: updatedData,
        });
        console.log('Update Response:', response.data); // Log phản hồi từ API
        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
        console.error('Error updating product specification:', error.response || error.message || error);
        throw error; // Thay đổi từ reject(error) thành throw error
    }
};
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
