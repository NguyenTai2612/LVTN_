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
            let deleteSpecificationsResponse;
            let deleteImagesResponse;

            console.log(`Attempting to delete product specifications for product ID ${productId}`);

            // Gửi yêu cầu xóa đặc tả sản phẩm nếu có
            try {
                deleteSpecificationsResponse = await axiosConfig({
                    method: 'delete',
                    url: `/api/v1/productSpecification/${productId}/deletebyProductId`,
                });

                console.log('Delete specifications response:', deleteSpecificationsResponse.data);

                if (deleteSpecificationsResponse?.data?.err !== 0) {
                    console.warn('Error deleting product specifications:', deleteSpecificationsResponse?.data?.msg);
                    return reject(new Error(deleteSpecificationsResponse?.data?.msg || 'Failed to delete product specifications'));
                }
            } catch (error) {
                console.warn('Failed to delete product specifications:', error.response?.data?.msg || error.message);
                // Bỏ qua nếu không có đặc tả sản phẩm hoặc lỗi không quan trọng
            }

            console.log(`Attempting to delete product images for product ID ${productId}`);

            // Gửi yêu cầu xóa hình ảnh sản phẩm nếu có
            try {
                deleteImagesResponse = await axiosConfig({
                    method: 'delete',
                    url: `/api/v1/productImage/${productId}/delete`,
                });

                console.log('Delete images response:', deleteImagesResponse.data);

                if (deleteImagesResponse?.data?.err !== 0) {
                    console.warn('Error deleting product images:', deleteImagesResponse?.data?.msg);
                    return reject(new Error(deleteImagesResponse?.data?.msg || 'Failed to delete product images'));
                }
            } catch (error) {
                console.warn('Failed to delete product images:', error.response?.data?.msg || error.message);
                // Bỏ qua nếu không có hình ảnh sản phẩm hoặc lỗi không quan trọng
            }

            console.log(`Attempting to delete product ${productId}`);

            // Gửi yêu cầu xóa sản phẩm
            try {
                const deleteProductResponse = await axiosConfig({
                    method: 'delete',
                    url: `/api/v1/product/${productId}`,
                });

                console.log('Delete product response:', deleteProductResponse.data);

                if (deleteProductResponse?.data?.err !== 0) {
                    console.warn('Error deleting product:', deleteProductResponse?.data?.msg);
                    return reject(new Error(deleteProductResponse?.data?.msg || 'Failed to delete product'));
                }

                // Thành công, trả về dữ liệu phản hồi
                resolve({
                    product: deleteProductResponse.data,
                    specifications: deleteSpecificationsResponse?.data || null,
                    images: deleteImagesResponse?.data || null
                });
            } catch (error) {
                console.error('Error occurred while deleting product:', error.response?.data?.msg || error.message);
                return reject(new Error(error.response?.data?.msg || 'Error occurred while deleting product'));
            }
        } catch (error) {
            // Xử lý lỗi nếu có vấn đề xảy ra
            console.error('Error occurred while deleting product and related data:', error.response?.data?.msg || error.message);
            reject(new Error(error.response?.data?.msg || 'Error occurred while deleting product and related data'));
        }
    });

export const deleteProductsAndImages = async (productIds) => {
    for (const productId of productIds) {
        try {
            await deleteProductAndImages(productId);
        } catch (error) {
            console.warn(`Error deleting product with ID ${productId}:`, error.message);
        }
    }
};


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