import axiosConfig from '../axiosConfig';

// Tạo đơn hàng
export const apiCreateOrder = (orderData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/order/`, 
            data: orderData,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Thêm sản phẩm vào đơn hàng
export const apiAddOrderItems = (orderId, items) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: `/api/v1/order/order-items`,
            data: {
                orderId,
                items
            },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Lưu thông tin thanh toán
export const apiSavePaymentInfo = (paymentData) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/order/payments',
            data: paymentData,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Lấy tất cả đơn hàng của người dùng
export const apiGetOrdersByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/order/user/${userId}`, 
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});