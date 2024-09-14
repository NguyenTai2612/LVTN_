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

export const apiUpdateOrderContact = (orderId, contactData) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'put',
                url: `/api/v1/order/${orderId}/contact`, // Đảm bảo URL đúng với route của bạn
                data: contactData,
                timeout: 5000, // Optional timeout of 5 seconds
            });
            resolve(response.data);
        } catch (error) {
            console.error("API Error:", error); // Log detailed error
            if (error.response && error.response.data && error.response.data.error) {
                reject(new Error(`Error: ${error.response.data.error}`));
            } else {
                reject(new Error(`Error updating contact: ${error.message}`));
            }
        }
    });

export const apiUpdateOrderStatus = (orderId, status) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/order/${orderId}/status`,
            data: { status },
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error updating order status: ' + error.message));
    }
});

export const apiUpdateOrderAddress = (orderId, orderData) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosConfig({
                method: 'put',
                url: `/api/v1/order/${orderId}`,
                data: orderData,
                timeout: 5000, // Optional timeout of 5 seconds
            });
            resolve(response.data);
        } catch (error) {
            console.error("API Error:", error); // Log detailed error
            if (error.response && error.response.data && error.response.data.message) {
                reject(new Error(`Error: ${error.response.data.message}`));
            } else {
                reject(new Error(`Error updating order: ${error.message}`));
            }
        }
    });