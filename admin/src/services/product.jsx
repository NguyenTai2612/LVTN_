import axios from 'axios'
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


export const apiAddProduct = (productData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/product/`,
            data: productData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

export const apiUpdateProduct = (productId, productData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/product/${productId}/update`,
            data: productData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

export const deleteProductAndImages = (productId) =>
    new Promise(async (resolve, reject) => {
        try {
            // Gửi yêu cầu xóa sản phẩm và các hình ảnh liên quan
            const response = await axiosConfig({
                method: 'delete',
                url: `/api/v1/product/${productId}`, // Điều chỉnh URL nếu cần thiết
            });

            // Kiểm tra xem phản hồi từ server có lỗi không
            if (response?.data?.err !== 0) {
                return reject(new Error(response?.data?.msg || 'Failed to delete product and images'));
            }

            // Thành công, trả về dữ liệu phản hồi
            resolve(response.data);
        } catch (error) {
            // Xử lý lỗi nếu có vấn đề xảy ra
            reject(new Error(error.response?.data?.msg || 'Error occurred while deleting product and images'));
        }
    });

export const apiGetProductPage = (page = 1, limit = 3) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/product/page?page=${page}&limit=${limit}`,
        });
        resolve(response.data); // Đảm bảo trả về đúng dữ liệu từ API
    } catch (error) {
        console.error('Error fetching products:', error.response || error.message || error);
        reject(error.response ? error.response.data : error.message || 'Unknown error');
    }
});