// services/review.js
import axiosConfig from '../axiosConfig';

// Lấy tất cả các đánh giá của sản phẩm
export const apiGetCurrent = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/user/get-current`,  
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
