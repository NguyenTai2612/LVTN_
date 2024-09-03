// services/review.js
import axiosConfig from '../axiosConfig';

// Lấy tất cả các đánh giá của sản phẩm
export const apiGetReviews = (productId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/review/${productId}`,  // Điều chỉnh URL nếu cần
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Đăng một đánh giá mới
export const apiAddReview = (reviewData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/review',  // Điều chỉnh URL nếu cần
            data: reviewData
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
