import axiosConfig from '../axiosConfig';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (cartData) => new Promise(async (resolve, reject) => {
    try {
        console.log("Cart Data:", cartData);
        const response = await axiosConfig({
            method: 'post',
            url: '/api/v1/cart',
            data: cartData
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error adding to cart: ' + error.message));
    }
});

// Lấy danh sách sản phẩm trong giỏ hàng của người dùng
export const getCartItems = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: `/api/v1/cart/${userId}`
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error fetching cart items: ' + error.message));
    }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (cartId, quantity) => {
    try {
        console.log("Updating cart item with cartId:", cartId, "and quantity:", quantity); // Kiểm tra dữ liệu
        const response = await axiosConfig({
            method: 'put',
            url: `/api/v1/cart/${cartId}`, // Giả sử cartId được gửi trong URL
            data: { quantity } // Chỉ gửi quantity
        });
        return response.data; // Trả về dữ liệu phản hồi
    } catch (error) {
        console.error('Error updating cart item:', error.message); // Đảm bảo có thông tin lỗi
        throw new Error('Error updating cart item: ' + error.message);
    }
};



// Xóa sản phẩm khỏi giỏ hàng
export const deleteCartItem = (cartId) => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'delete',
            url: `/api/v1/cart/${cartId}`
        });
        resolve(response.data);
    } catch (error) {
        reject(new Error('Error deleting cart item: ' + error.message));
    }
});
