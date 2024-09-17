import axiosConfig from '../axiosConfig';

// API to get total number of products
export const apiGetTotalProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/total-products',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get products by category
export const apiGetProductsByCategory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/products-by-category',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get products by subcategory
export const apiGetProductsBySubCategory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/products-by-subcategory',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get best-selling products
export const apiGetBestSellingProduct = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/best-selling-product',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get products in stock
export const apiGetProductsInStock = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/products-in-stock',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get discounted products
export const apiGetDiscountedProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/discounted-products',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get top-rated products
export const apiGetTopRatedProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/top-rated-products',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get products by brand
export const apiGetProductsByBrand = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/products-by-brand',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});


// API to get out-of-stock products
export const apiGetOutOfStockProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/out-of-stock-products',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});


// API to get revenue by category
export const apiGetRevenueByCategory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/revenue-by-category',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// API to get revenue by subcategory
export const apiGetRevenueBySubCategory = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/revenue-by-subcategory',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

////////////////////////////////////////


// 1. API thống kê doanh thu tổng
export const apiGetTotalRevenue = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/actualy-revenue',
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// 2. API thống kê sản phẩm mới được thêm
export const apiGetNewProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/new-products',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 3. API thống kê các sản phẩm đã hết hàng
// export const apiGetOutOfStockProducts = () => new Promise(async (resolve, reject) => {
//     try {
//         const response = await axiosConfig({
//             method: 'get',
//             url: '/api/v1/stats/out-of-stock-products',
//         });
//         resolve(response.data);
//     } catch (error) {
//         reject(error);
//     }
// });

// 4. API thống kê lượt xem sản phẩm
export const apiGetProductViews = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/product-views',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 7. API thống kê số lượng bán ra theo tháng
export const apiGetMonthlySales = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/monthly-sales',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 7. API thống kê số lượng bán ra theo tuần
export const apiGetWeeklySales = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/week-sales',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 7. API thống kê số lượng bán ra theo ngày
export const apiGetDailySales = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/daily-sales',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 8. API thống kê tổng số đơn hàng
export const apiGetTotalOrders = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/total-orders',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 9. API thống kê doanh thu theo từng sản phẩm
export const apiGetRevenueByProduct = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/revenue-by-product',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 9. API thống kê doanh thu thực tế theo từng sản phẩm
export const apiGetActualRevenueByProduct = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/actualy-revenue-by-product',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});

// 10. API thống kê đơn hàng bị hủy nhiều nhất
export const apiGetMostCanceledProducts = () => new Promise(async (resolve, reject) => {
    try {
        const response = await axiosConfig({
            method: 'get',
            url: '/api/v1/stats/most-canceled-products',
        });
        resolve(response.data);
    } catch (error) {
        reject(error);
    }
});














