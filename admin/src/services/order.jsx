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

// API để lấy chi tiết đơn hàng
export const apiGetOrderById = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/order/${orderId}`,
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error fetching order details: ' + error.message));
    }
});

// API để cập nhật trạng thái đơn hàng
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

// API để xóa đơn hàng
export const apiDeleteOrder = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/order/${orderId}`,
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error deleting order: ' + error.message));
    }
});

// API để xem lịch sử thanh toán của đơn hàng
export const apiGetOrderPayments = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/order/${orderId}/payments`,
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error fetching order payments: ' + error.message));
    }
});

// API để cập nhật thông tin đơn hàng

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



// API để xem tất cả các sản phẩm trong một đơn hàng
export const apiGetOrderItems = (orderId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/order/${orderId}/items`,
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error fetching order items: ' + error.message));
    }
});

// API để lấy tất cả đơn hàng
export const apiGetAllOrders = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/order/', // Địa chỉ API để lấy tất cả đơn hàng
        });
        resolve(response); // Trả về dữ liệu đơn hàng
    } catch (error) {
        reject(error); // Xử lý lỗi nếu có
    }
});